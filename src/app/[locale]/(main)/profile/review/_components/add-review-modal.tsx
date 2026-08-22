"use client";

import { useState, useRef } from "react";
import { Star, ImagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiProxyUrl } from "@/config";
import type { PendingReviewItem } from "@/services/review/types";

export function AddReviewModal({
  item,
  onClose,
}: {
  item: PendingReviewItem | null;
  onClose: () => void;
}) {
  const t = useTranslations("ProfilePages.review.addModal");
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    if (submitting) return;
    setRating(0);
    setHovered(0);
    setKomentar("");
    setImage(null);
    setImagePreview(null);
    onClose();
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit() {
    if (!item) return;
    if (rating === 0) {
      toast.error(t("ratingRequired"));
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("pesanan_item_id", item.pesanan_item_id);
      formData.append("rating", String(rating));
      if (komentar.trim()) formData.append("komentar", komentar.trim());
      if (image) formData.append("gambar", image);

      // Same-origin proxy call; the httpOnly session cookie is sent automatically.
      await axios.post(`${apiProxyUrl}/web/review`, formData);

      toast.success(t("successMessage"));
      await queryClient.invalidateQueries({ queryKey: ["review-pending"] });
      handleClose();
    } catch {
      toast.error(t("errorMessage"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        {item && (
          <div className="space-y-5">
            {/* Product name */}
            <p className="text-sm font-medium text-black">{item.nama_produk}</p>

            {/* Star rating */}
            <div>
              <p className="mb-2 text-xs text-[#727272]">{t("ratingLabel")}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110"
                    aria-label={`${star} bintang`}
                  >
                    <Star
                      className="size-8"
                      fill={(hovered || rating) >= star ? "#ffcf02" : "none"}
                      stroke={(hovered || rating) >= star ? "#ffcf02" : "#d9d9d9"}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <p className="mb-2 text-xs text-[#727272]">{t("commentLabel")}</p>
              <textarea
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
                placeholder={t("commentPlaceholder")}
                rows={3}
                className="w-full resize-none rounded border border-[#d9d9d9] px-3 py-2 text-sm text-black outline-none transition-colors placeholder:text-[#b0b0b0] focus:border-[#ffcf02]"
              />
            </div>

            {/* Image upload */}
            <div>
              <p className="mb-2 text-xs text-[#727272]">{t("imageLabel")}</p>
              {imagePreview ? (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="size-24 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-[#727272] text-white hover:bg-black"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex size-24 flex-col items-center justify-center gap-1 rounded border border-dashed border-[#d9d9d9] text-[#727272] transition-colors hover:border-[#ffcf02] hover:text-[#ffcf02]"
                >
                  <ImagePlus className="size-6" />
                  <span className="text-xs">{t("imageHint")}</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded bg-[#ffcf02] py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#f0c300] disabled:opacity-60"
            >
              {submitting ? t("submitting") : t("submit")}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
