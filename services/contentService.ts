import { apiService } from "../services/apiService";

export async function getBanners() {
  // Placeholder: return static banners until backend is ready
  return [{ id: "1", title: "New Launch", image_url: "", cta_link: "/studio" }];
}

export async function getContentItems(type?: string) {
  return apiService
    .get(`/content/items${type ? `?type=${type}` : ""}`)
    .catch(() => []);
}
