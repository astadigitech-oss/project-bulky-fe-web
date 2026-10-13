export type WebSeasonalCampaign = {
  id: string;
  name: string;
  web_logo_url: string | null;
  web_navbar_decoration_url: string | null;
  ends_at: string;
};

export type WebSeasonalCampaignResponse = {
  success: boolean;
  message: string;
  data: WebSeasonalCampaign | null;
};
