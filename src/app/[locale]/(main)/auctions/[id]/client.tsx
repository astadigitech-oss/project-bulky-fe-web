"use client";

import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, CircleQuestionMark, Eye, History, MapPin, PackageOpen, Scale, Ruler, Tag, Tags, TriangleAlert, Truck, X } from "lucide-react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useApiQuery } from "@/lib/query/use-query";
import { formatRupiah } from "@/lib/utils";
import { apiProxyUrl } from "@/config";
import { useSession } from "@/providers/session-provider";
import { MapPickerTrigger, type ResolvedAddress } from "@/components/map-picker";
import { AuctionBidsDialog } from "@/components/navbar/auction-bids-dialog";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { AuctionDetailResponse, OwnBidResponse, ShippingDestination, ShippingEstimate, ShippingEstimatesResponse } from "@/services/auctions/types";
import type { GetTermsConditionsResponse } from "@/services/terms-conditions/types";

type BidMode = "AMOUNT" | "PERCENT";

const apiError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) return (error.response?.data as { message?: string } | undefined)?.message ?? fallback;
  return fallback;
};

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const formatAuctionNumber = (locale: string, value: number, maximumFractionDigits = 3) => new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", { maximumFractionDigits }).format(value);

export function AuctionDetailClient() {
  const { id: slug } = useParams<{ id: string }>();
  const locale = useLocale();
  const t = useTranslations("Auction");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: sessionLoading } = useSession();
  const [imageIndex, setImageIndex] = useState(0);
  const [mode, setMode] = useState<BidMode>("AMOUNT");
  const [amountInput, setAmountInput] = useState("");
  const [percentInput, setPercentInput] = useState("");
  const [note, setNote] = useState("");
  const [destination, setDestination] = useState<ShippingDestination>({ address: "", provinsi: "", kota: "", kecamatan: "" });
  const [shipping, setShipping] = useState<ShippingEstimate[]>([]);
  const [selectedQuoteID, setSelectedQuoteID] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [auctionTermsOpen, setAuctionTermsOpen] = useState(false);
  const [agreedTermsVersion, setAgreedTermsVersion] = useState("");
  const [bidSuccessOpen, setBidSuccessOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [batchBidsOpen, setBatchBidsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const pendingKey = useRef<string | null>(null);
  const viewRecorded = useRef(false);

  const detailQuery = useApiQuery<AuctionDetailResponse>({
    key: ["auction-detail", locale, slug], endpoint: `/web/auctions/${slug}`, searchParams: { locale }, enabled: Boolean(slug), retry: false,
  });
  const auctionTermsQuery = useApiQuery<GetTermsConditionsResponse>({
    key: ["auction-terms-conditions", locale],
    endpoint: "/web/syarat-ketentuan-lelang",
    searchParams: { locale },
    enabled: confirmOpen,
  });
  const auctionTerms = auctionTermsQuery.data?.data;
  const termsAgreed = Boolean(auctionTerms?.terms_version && agreedTermsVersion === auctionTerms.terms_version);
  const auction = detailQuery.data?.data;
  const numericAmount = Number(digitsOnly(amountInput)) || 0;
  const numericPercent = Number(percentInput.replace(",", ".")) || 0;
  const percentAmount = auction ? Math.ceil((Number(auction.grand_total) * numericPercent) / 100) : 0;
  const bidAmount = mode === "AMOUNT" ? numericAmount : percentAmount;
  const minAmount = Number(auction?.min_bid_amount ?? 0);
  const inputValid = bidAmount >= minAmount && (mode === "AMOUNT" ? numericAmount > 0 : numericPercent >= (auction?.min_bid_percent ?? 0.1));
  const selectedQuote = shipping.find((quote) => quote.shipping_quote_id === selectedQuoteID);
  const ppnPreview = selectedQuote ? Math.ceil((bidAmount * 11) / 100) : 0;
  const totalPreview = selectedQuote ? bidAmount + ppnPreview + Number(selectedQuote.amount) : 0;

  useEffect(() => {
    if (!auction || viewRecorded.current || !slug) return;
    viewRecorded.current = true;
    void axios.post(`${apiProxyUrl}/web/auctions/${auction.id}/views`, { event_id: crypto.randomUUID() }).catch(() => undefined);
  }, [auction, slug]);

  useEffect(() => {
    if (!confirmOpen) setAgreedTermsVersion("");
  }, [confirmOpen]);

  const requireLogin = () => {
    if (isAuthenticated) return true;
    if (!sessionLoading) {
      toast.warning(t("loginRequiredToast"));
      const next = encodeURIComponent(`/auctions/${slug}`);
      router.push(`/login?reason=auth-required&action=auction-bid&next=${next}`);
    }
    return false;
  };

  const getShipping = async () => {
    if (!destination.address || !destination.provinsi || !destination.kota || !destination.kecamatan) {
      toast.error(t("addressIncomplete"));
      return;
    }
    setQuoteLoading(true);
    setShipping([]);
    setSelectedQuoteID("");
    try {
      const response = await axios.post<ShippingEstimatesResponse>(`${apiProxyUrl}/web/auctions/${auction?.id}/shipping-estimates`, destination);
      setShipping(response.data.data);
      const firstAvailable = response.data.data.find((quote) => quote.shipping_quote_id);
      if (firstAvailable) setSelectedQuoteID(firstAvailable.shipping_quote_id);
    } catch (error) {
      toast.error(apiError(error, t("shippingUnavailableForDestination")));
    } finally {
      setQuoteLoading(false);
    }
  };

  const reviewBid = () => {
    if (!requireLogin()) return;
    if (!inputValid) {
      toast.error(t("minimumBidError", { amount: formatRupiah(auction?.min_bid_amount ?? "0") }));
      return;
    }
    if (!selectedQuoteID) {
      toast.error(t("selectShippingBeforeBid"));
      return;
    }
    setSubmitError("");
    setConfirmOpen(true);
  };

  const submitBid = async () => {
    if (!auction || !selectedQuoteID) return;
    if (!termsAgreed || !auctionTerms?.terms_version) {
      toast.error(t("submitTermsRequired"));
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    const key = pendingKey.current ?? `bid-${crypto.randomUUID()}`;
    pendingKey.current = key;
    const consent = {
      terms_agreed: termsAgreed,
      terms_version: auctionTerms.terms_version,
    };
    const body = mode === "AMOUNT"
      ? { input_mode: "AMOUNT", amount: String(bidAmount), shipping_quote_id: selectedQuoteID, note: note.trim(), ...consent }
      : { input_mode: "PERCENT", input_percent: percentInput.replace(",", "."), shipping_quote_id: selectedQuoteID, note: note.trim(), ...consent };
    try {
      const response = await axios.post<OwnBidResponse>(`${apiProxyUrl}/web/auctions/${auction.id}/bids?locale=${locale}`, body, { headers: { "Idempotency-Key": key } });
      pendingKey.current = null;
      setConfirmOpen(false);
      setNote("");
      await queryClient.invalidateQueries({ queryKey: ["auction-my-bids"] });
      setBidSuccessOpen(true);
      return response;
    } catch (error) {
      setSubmitError(apiError(error, t("submitUncertain")));
    } finally {
      setSubmitting(false);
    }
  };

  if (detailQuery.isLoading) return <main className="mx-auto min-h-[70vh] max-w-7xl animate-pulse px-4 py-10"><div className="h-[32rem] rounded-lg bg-[#e7e7e1]" /></main>;
  if (detailQuery.isError || !auction) return <main className="mx-auto flex min-h-[55vh] max-w-7xl items-center px-4 py-10"><div className="border border-red-200 bg-red-50 p-5 text-red-700">{t("unavailable")}</div></main>;

  const activeImage = auction.images[imageIndex] ?? auction.images[0];
  const previousImage = () => {
    if (auction.images.length > 0) setImageIndex((current) => (current - 1 + auction.images.length) % auction.images.length);
  };
  const nextImage = () => {
    if (auction.images.length > 0) setImageIndex((current) => (current + 1) % auction.images.length);
  };
  return (
    <main className="bg-[#f6f6f4] py-8 sm:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-xs"><BreadcrumbLink href="/">Bulky</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="text-xs"><BreadcrumbLink href="/auctions">{t("title")}</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0 text-xs"><BreadcrumbPage className="block truncate">{auction.name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-5 grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-[#f4f4f4]">
                {activeImage ? <Image src={activeImage} alt={auction.name} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" /> : <PackageOpen className="absolute inset-0 m-auto size-14 text-gray-400" />}
                {auction.images.length > 1 ? <>
                  <button type="button" onClick={previousImage} className="absolute left-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-sm hover:bg-white" aria-label={t("previousImage")}><ChevronLeft className="size-4" /></button>
                  <button type="button" onClick={nextImage} className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-sm hover:bg-white" aria-label={t("nextImage")}><ChevronRight className="size-4" /></button>
                </> : null}
              </div>
              {auction.images.length > 1 ? <div className="grid grid-cols-5 gap-2">{auction.images.slice(0, 10).map((image, index) => <button key={image} type="button" onClick={() => setImageIndex(index)} className="cursor-pointer" aria-label={t("viewImage", { index: String(index + 1) })}><span className={`relative block aspect-square overflow-hidden rounded-xl border ${imageIndex === index ? "border-yellow-500" : "border-gray-200"}`}><Image src={image} alt="" fill sizes="12vw" className="object-cover" /></span></button>)}</div> : null}
            </div>
          </section>

          <section className="min-w-0 pt-1 lg:col-span-4 lg:pt-8">
            <p className="text-sm font-semibold text-cyan-700">{auction.code}</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-black sm:text-4xl">{auction.name}</h1>
            <div className="mt-4"><span className="inline-flex rounded-full border border-[#879a56] bg-[#eff4df] px-2.5 py-1 text-xs font-semibold text-[#4b5e1f]">{t("openStatus")}</span></div>
            <div className="mt-5">
              <p className="text-sm text-gray-500">{t("batchValue")}</p>
              <p className="mt-1 text-3xl font-bold leading-tight text-orange-500">{formatRupiah(auction.grand_total)}</p>
            </div>
            <Separator className="my-5 bg-gray-200" />
            <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm">
              <p className="text-gray-700">{t("minimumBid")}</p><p className="font-medium">{formatRupiah(auction.min_bid_amount)} <span className="font-normal text-gray-500">({formatAuctionNumber(locale, auction.min_bid_percent, 4)}%)</span></p>
              <p className="text-gray-700">{t("origin")}</p><p className="flex items-start gap-1.5 leading-snug"><MapPin className="mt-0.5 size-4 shrink-0" />{auction.origin.label}{auction.origin.city ? `, ${auction.origin.city}` : ""}</p>
            </div>
            {auction.description ? <><Separator className="my-5 bg-gray-200" /><p className="whitespace-pre-line text-sm leading-6 text-gray-700">{auction.description}</p></> : null}
          </section>

          <BidPanel mode={mode} setMode={(value) => { setMode(value); setAmountInput(""); setPercentInput(value === "PERCENT" ? String(auction.min_bid_percent) : ""); }} amountInput={amountInput} setAmountInput={setAmountInput} percentInput={percentInput} setPercentInput={setPercentInput} bidAmount={bidAmount} minAmount={minAmount} minPercent={auction.min_bid_percent} selectedQuote={selectedQuote} inputValid={inputValid} isAuthenticated={isAuthenticated} sessionLoading={sessionLoading} onReview={reviewBid} onOpenHistory={() => setBatchBidsOpen(true)} />
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <AuctionInfo auction={auction} onOpenPDF={() => setPdfOpen(true)} />
          <ShippingForm destination={destination} setDestination={setDestination} loading={quoteLoading} shipping={shipping} selectedQuoteID={selectedQuoteID} setSelectedQuoteID={setSelectedQuoteID} onCalculate={getShipping} />
        </section>
      </div>
      <Dialog open={confirmOpen} onOpenChange={(open) => { setConfirmOpen(open); if (!open) setAuctionTermsOpen(false); }}>
        <DialogContent className="max-w-lg bg-white p-6">
          <DialogHeader><DialogTitle>{t("confirmBidTitle")}</DialogTitle><DialogDescription>{t("confirmBidDescription")}</DialogDescription></DialogHeader>
          <dl className="space-y-3 border-y border-[#e1e1da] py-4 text-sm"><div className="flex justify-between gap-4"><dt>{t("batch")}</dt><dd className="text-right font-semibold">{auction.name}</dd></div><div className="flex justify-between gap-4"><dt>{t("bidAmount")}</dt><dd className="font-semibold">{formatRupiah(bidAmount)}</dd></div><div className="flex justify-between gap-4"><dt>{t("estimatedTax")}</dt><dd>{formatRupiah(ppnPreview)}</dd></div><div className="flex justify-between gap-4"><dt>{t("estimatedShipping")}</dt><dd>{selectedQuote ? formatRupiah(selectedQuote.amount) : "-"}</dd></div><div className="flex justify-between gap-4 border-t pt-3 font-semibold"><dt>{t("estimatedTotal")}</dt><dd>{formatRupiah(totalPreview)}</dd></div></dl>
          <div className="space-y-2"><div className="flex items-baseline justify-between gap-3"><Label htmlFor="auction-bid-note">{t("bidNote")}</Label><span className="text-xs text-gray-500">{t("optional")}</span></div><Textarea id="auction-bid-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} rows={3} placeholder={t("bidNotePlaceholder")} /><p className="text-right text-xs text-gray-500">{t("characters", { count: String(note.length), max: "1000" })}</p></div>
          <p className="text-xs leading-5 text-[#62625d]">{t("estimateDisclaimer")}</p>
          <section className="space-y-3 rounded-xl border border-[#e1e1da] bg-[#fafaf7] p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-black">{t("auctionTermsTitle")}</h3>
              <button type="button" aria-haspopup="dialog" onClick={() => setAuctionTermsOpen(true)} className="shrink-0 text-xs font-semibold text-[#806a00] underline underline-offset-2">{t("viewAuctionTerms")}</button>
            </div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-[#30302d]">
              <Checkbox checked={termsAgreed} onCheckedChange={(checked) => setAgreedTermsVersion(checked === true ? auctionTerms?.terms_version ?? "" : "")} disabled={auctionTermsQuery.isLoading || auctionTermsQuery.isError || !auctionTerms?.konten || !auctionTerms.terms_version} />
              <span>{t("agreeAuctionTerms")}</span>
            </label>
          </section>
          <Dialog open={auctionTermsOpen} onOpenChange={setAuctionTermsOpen}>
            <DialogContent className="max-h-[85vh] max-w-2xl bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
              <DialogHeader>
                <DialogTitle>{t("auctionTermsTitle")}</DialogTitle>
              </DialogHeader>
              <div className="max-h-[calc(85vh-8rem)] overflow-y-auto rounded-lg border border-[#e1e1da] bg-white p-4 text-sm leading-6 text-[#4e4e49]">
                {auctionTermsQuery.isLoading ? <p>{t("auctionTermsLoading")}</p> : auctionTermsQuery.isError || !auctionTermsQuery.data?.data?.konten ? <p className="text-red-600">{t("auctionTermsLoadError")}</p> : <div className="prose prose-sm max-w-none text-[#3f3f3f] [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-black [&_h2]:first:mt-0 [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-black [&_p]:mb-3 [&_p]:leading-relaxed [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_table]:mt-4 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-gray-200 [&_th]:bg-[#fef8ec] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2" dangerouslySetInnerHTML={{ __html: auctionTermsQuery.data.data.konten }} />}
              </div>
            </DialogContent>
          </Dialog>
          {submitError ? <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{submitError}</p> : null}
          <DialogFooter><Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={submitting}>{t("cancel")}</Button><Button onClick={submitBid} disabled={submitting || !termsAgreed || auctionTermsQuery.isLoading || auctionTermsQuery.isError || !auctionTermsQuery.data?.data?.konten || !auctionTermsQuery.data?.data?.terms_version} className="bg-[#ffcf02] text-black hover:bg-[#eabb00]">{submitting ? t("submittingBid") : t("submitBid")}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={bidSuccessOpen} onOpenChange={setBidSuccessOpen}>
        <DialogContent className="flex w-[calc(100%-2rem)] max-w-xl flex-col items-center justify-center gap-6 p-8!" showCloseButton={false}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative h-7 aspect-[19/4] w-36">
              <Image src="/assets/images/logo-bulky.webp" alt="Bulky" fill className="object-contain" sizes="144px" />
            </div>
            <p className="text-xl font-medium">{t("bidSuccessTitle")}</p>
            <p className="text-sm text-gray-500">{t("bidSuccessDescription")}</p>
          </div>
          <DotLottieReact src="/assets/lottie/bid-success.lottie" autoplay loop className="size-52" aria-label={t("bidSuccessTitle")} />
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
            <Button className="h-12 w-full rounded-full bg-gray-200 text-black hover:bg-gray-300 sm:flex-1" size="lg" onClick={() => { setBidSuccessOpen(false); router.push("/auctions"); }}>
              <ArrowLeft />
              {t("bidSuccessContinue")}
            </Button>
            <Button className="h-12 w-full rounded-full bg-yellow-400 text-black hover:bg-yellow-500 sm:flex-1" size="lg" onClick={() => { setBidSuccessOpen(false); setBatchBidsOpen(true); }}>
              {t("bidSuccessViewHistory")}
              <ArrowRight />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent className="h-[90vh]! w-[90vw]! max-w-6xl! p-3" showCloseButton={false}>
          <button type="button" onClick={() => setPdfOpen(false)} aria-label={t("closeDocument")} className="absolute -right-3 -top-3 z-30 flex size-9 items-center justify-center rounded-full border-2 border-white bg-black text-white shadow-lg hover:bg-gray-800"><X className="size-4" /></button>
          {auction.pdf ? <iframe src={`${auction.pdf.url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`} title={auction.pdf.name} className="h-full w-full" /> : null}
        </DialogContent>
      </Dialog>
      <AuctionBidsDialog open={batchBidsOpen} onOpenChange={setBatchBidsOpen} batchID={auction.id} title={t("batchBidHistory")} />
    </main>
  );
}

function BidPanel({ mode, setMode, amountInput, setAmountInput, percentInput, setPercentInput, bidAmount, minAmount, minPercent, selectedQuote, inputValid, isAuthenticated, sessionLoading, onReview, onOpenHistory }: { mode: BidMode; setMode: (mode: BidMode) => void; amountInput: string; setAmountInput: (value: string) => void; percentInput: string; setPercentInput: (value: string) => void; bidAmount: number; minAmount: number; minPercent: number; selectedQuote?: ShippingEstimate; inputValid: boolean; isAuthenticated: boolean; sessionLoading: boolean; onReview: () => void; onOpenHistory: () => void }) {
  const t = useTranslations("Auction");
  const typedPercent = Number(percentInput.replace(",", "."));
  const sliderMax = 100;
  const sliderValue = Math.min(Math.max(typedPercent || minPercent, minPercent), sliderMax);
  return (
    <aside className="h-fit rounded-2xl border border-gray-300 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:col-span-3">
      <h2 className="text-lg font-bold">{t("bid")}</h2>
      <p className="mt-1 text-xs leading-5 text-gray-500">{t("privateBid")}</p>
      <div className="mt-5 grid grid-cols-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
        <button type="button" onClick={() => setMode("AMOUNT")} className={`h-9 rounded-md text-sm font-medium ${mode === "AMOUNT" ? "bg-yellow-400 text-black" : "text-gray-500"}`}>{t("amount")}</button>
        <button type="button" onClick={() => setMode("PERCENT")} className={`h-9 rounded-md text-sm font-medium ${mode === "PERCENT" ? "bg-yellow-400 text-black" : "text-gray-500"}`}>{t("percentage")}</button>
      </div>
      {mode === "AMOUNT" ? <div className="mt-5"><Label htmlFor="bid-value">{t("bidAmountLabel")}</Label><Input id="bid-value" inputMode="numeric" value={amountInput} onChange={(event) => setAmountInput(digitsOnly(event.target.value))} placeholder={t("bidAmountPlaceholder")} className="mt-2 h-11" /></div> : <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-4"><div className="flex items-center justify-between"><Label>{t("bidPercentageLabel")}</Label><strong className="text-sm text-black">{sliderValue.toFixed(1)}%</strong></div><Slider className="mt-5" value={[sliderValue]} min={minPercent} max={sliderMax} step={0.1} onValueChange={(value) => { const percent = typeof value === "number" ? value : value[0]; setPercentInput(percent.toFixed(1)); }} /><div className="mt-3 flex items-center justify-between text-[11px] text-gray-500"><span>{minPercent}%</span><span>{sliderMax}%</span></div></div>}
      <Separator className="my-4 bg-gray-200" />
      <div className="space-y-2 text-xs text-gray-600">
        <p>{t("minimum")}: {formatRupiah(minAmount)}</p>
        {mode === "PERCENT" && percentInput ? <p>{t("bidValue")}: <strong className="text-black">{formatRupiah(bidAmount)}</strong></p> : null}
        {selectedQuote ? <p>{t("selectedShipping")}: <strong className="text-black">{formatRupiah(selectedQuote.amount)}</strong></p> : <p className="text-[#9a6d12]">{t("shippingNotSelected")}</p>}
      </div>
      <Button onClick={onReview} disabled={sessionLoading || !isAuthenticated || !inputValid || !selectedQuote} className="mt-6 h-11 w-full bg-yellow-400 text-black hover:bg-yellow-500">{!sessionLoading && !isAuthenticated ? t("loginToReviewBid") : t("reviewBid")}</Button>
      {!sessionLoading && !isAuthenticated ? <p className="mt-2 text-center text-xs leading-5 text-gray-500">{t("loginRequiredToReview")}</p> : null}
      <Button type="button" variant="outline" onClick={onOpenHistory} className="mt-2 h-10 w-full"><History className="size-4" />{t("batchBidHistory")}</Button>
    </aside>
  );
}

function AuctionInfo({ auction, onOpenPDF }: { auction: AuctionDetailResponse["data"]; onOpenPDF: () => void }) {
  const t = useTranslations("Auction");
  const productDetailT = useTranslations("ProductDetail");
  const locale = useLocale();
  const metadata = [
    { label: t("category"), value: auction.category?.name, icon: <Tags className="size-4" /> },
    { label: t("productCondition"), value: auction.product_condition?.name, icon: <Tag className="size-4" /> },
    { label: t("packageCondition"), value: auction.package_condition?.name, icon: <PackageOpen className="size-4" /> },
    { label: t("source"), value: auction.source?.name, icon: <Tag className="size-4" /> },
  ].flatMap((item) => item.value ? [item] : []);

  return <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"><h2 className="text-xl font-bold">{t("detailBatch")}</h2><div className="mt-5 grid gap-2 text-sm sm:grid-cols-2"><DetailStat label={t("dimensions")} value={`${formatAuctionNumber(locale, auction.dimensions.panjang_cm)} x ${formatAuctionNumber(locale, auction.dimensions.lebar_cm)} x ${formatAuctionNumber(locale, auction.dimensions.tinggi_cm)} cm`} icon={<Ruler className="size-4" />} /><DetailStat label={t("weight")} value={`${formatAuctionNumber(locale, auction.berat_kg)} kg`} icon={<Scale className="size-4" />} /><DetailStat label={t("volume")} value={`${formatAuctionNumber(locale, auction.volume_m3)} m³`} icon={<PackageOpen className="size-4" />} /><DetailStat label={t("discrepancy")} value={`${formatAuctionNumber(locale, auction.discrepancy_percentage, 2)}%`} icon={<TriangleAlert className="size-4" />} tooltip={{ ariaLabel: productDetailT("discrepancyInfoAria"), content: productDetailT("discrepancyTooltip") }} /></div>{metadata.length > 0 ? <><Separator className="my-6 bg-gray-200" /><h3 className="font-semibold">{t("classification")}</h3><div className="mt-4 grid gap-2 sm:grid-cols-2">{metadata.map((item) => <DetailStat key={item.label} {...item} />)}</div></> : null}<Separator className="my-6 bg-gray-200" /><h3 className="font-semibold">{t("batchItems")}</h3><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[34rem] text-left text-sm"><thead className="border-y border-gray-200 text-xs text-gray-500"><tr><th className="py-3 font-medium">{t("item")}</th><th className="py-3 font-medium">{t("quantity")}</th><th className="py-3 text-right font-medium">{t("unitPrice")}</th><th className="py-3 text-right font-medium">{t("subtotal")}</th></tr></thead><tbody>{auction.items.map((item, index) => <tr key={`${item.name}-${index}`} className="border-b border-gray-100"><td className="py-3 font-medium">{item.name}</td><td className="py-3">{item.quantity}</td><td className="py-3 text-right">{formatRupiah(item.unit_price)}</td><td className="py-3 text-right">{formatRupiah(item.subtotal)}</td></tr>)}</tbody></table></div>{auction.pdf ? <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2.5"><p className="text-sm font-medium text-gray-800">{t("batchDocument")}</p><Button variant="outline" className="h-9 shrink-0" onClick={onOpenPDF}><Eye className="size-4" />{t("viewDocument")}</Button></div> : null}</section>;
}

function DetailStat({ label, value, icon, tooltip }: { label: string; value: string; icon: React.ReactNode; tooltip?: { ariaLabel: string; content: string } }) { return <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"><div className="flex items-center gap-2 text-[11px] text-gray-500">{icon}{label}{tooltip ? <span className="relative inline-flex items-center group"><button type="button" aria-label={tooltip.ariaLabel} className="inline-flex items-center"><CircleQuestionMark className="size-3.5" /></button><span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-72 -translate-x-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-sm text-black shadow-md opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">{tooltip.content}</span></span> : null}</div><p className="mt-1 text-sm font-medium">{value}</p></div>; }

function ShippingForm({ destination, setDestination, loading, shipping, selectedQuoteID, setSelectedQuoteID, onCalculate }: { destination: ShippingDestination; setDestination: (value: ShippingDestination) => void; loading: boolean; shipping: ShippingEstimate[]; selectedQuoteID: string; setSelectedQuoteID: (value: string) => void; onCalculate: () => void }) {
  const t = useTranslations("Auction");
  const setField = (field: keyof ShippingDestination, value: string) => setDestination({ ...destination, [field]: value });
  const hasCoordinates =
    Number.isFinite(destination.latitude) &&
    Number.isFinite(destination.longitude) &&
    (destination.latitude !== 0 || destination.longitude !== 0);
  const applyMapLocation = (latitude: string, longitude: string, resolved?: ResolvedAddress) => {
    setDestination({
      ...destination,
      latitude: Number(latitude),
      longitude: Number(longitude),
      address: resolved?.address_detail || destination.address,
      provinsi: resolved?.province || destination.provinsi,
      kota: resolved?.city || destination.kota,
      kecamatan: resolved?.district || destination.kecamatan,
    });
  };
  return <section className="h-fit rounded-2xl border border-gray-200 bg-white p-5"><h2 className="flex items-center gap-2 text-lg font-bold"><Truck className="size-5" />{t("shipping")}</h2><p className="mt-1 text-xs leading-5 text-gray-500">{t("shippingEstimateNote")}</p><div className="mt-5 space-y-3"><MapPickerTrigger latitude={String(destination.latitude ?? "")} longitude={String(destination.longitude ?? "")} onConfirm={applyMapLocation} /><div><Label htmlFor="destination-address">{t("destinationAddress")}</Label><Input id="destination-address" value={destination.address} onChange={(e) => setField("address", e.target.value)} disabled={!hasCoordinates} className="mt-1" /></div><div className="grid grid-cols-2 gap-3"><div><Label htmlFor="destination-province">{t("province")}</Label><Input id="destination-province" value={destination.provinsi} onChange={(e) => setField("provinsi", e.target.value)} disabled={!hasCoordinates} className="mt-1" /></div><div><Label htmlFor="destination-city">{t("cityOrRegency")}</Label><Input id="destination-city" value={destination.kota} onChange={(e) => setField("kota", e.target.value)} disabled={!hasCoordinates} className="mt-1" /></div></div><div><Label htmlFor="destination-district">{t("district")}</Label><Input id="destination-district" value={destination.kecamatan} onChange={(e) => setField("kecamatan", e.target.value)} disabled={!hasCoordinates} className="mt-1" /></div><Button type="button" variant="outline" onClick={onCalculate} disabled={loading || !hasCoordinates} className="mt-1 w-full">{loading ? t("calculatingShipping") : t("checkShipping")}</Button></div>{shipping.length > 0 ? <div className="mt-5 space-y-2 border-t border-gray-200 pt-4">{shipping.map((quote) => { const available = Boolean(quote.shipping_quote_id); const chosen = quote.shipping_quote_id === selectedQuoteID; return <button key={quote.provider} type="button" disabled={!available} onClick={() => setSelectedQuoteID(quote.shipping_quote_id)} className={`w-full rounded-lg border p-3 text-left disabled:cursor-not-allowed disabled:opacity-55 ${chosen ? "border-yellow-500 bg-yellow-50" : "border-gray-200"}`}><div className="flex justify-between gap-3"><span className="font-semibold">{quote.label}</span><span className="font-semibold">{available ? formatRupiah(quote.amount) : t("unavailableShipping")}</span></div>{quote.sla_days ? <p className="mt-1 text-xs text-gray-500">{t("estimatedDays", { days: String(quote.sla_days) })}</p> : null}</button>; })}</div> : null}</section>;
}
