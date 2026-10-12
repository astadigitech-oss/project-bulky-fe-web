export type WebSeasonalCampaign = {
  id: string;
  nama: string;
  web_logo_url: string | null;
  web_navbar_decoration_url: string | null;
  tanggal_selesai: string;
};

export type WebSeasonalCampaignResponse = {
  success: boolean;
  message: string;
  data: WebSeasonalCampaign | null;
};
