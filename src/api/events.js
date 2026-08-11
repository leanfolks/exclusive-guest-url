import httpClient from "./httpClient";

export const getEvents = (params) => {
  return httpClient({
    method: "GET",
    url: "/events/get-results",
    params,
  });
};

export const getEventBySlug = (params) => {
  return httpClient({
    method: "GET",
    url: "/events/get-eventbyslug",
    params,
  });
};

export const updateEventStatus = (params, data) => {
  return httpClient({
    method: "PUT",
    url: "/events/update-event-status",
    params,
    data
  });
};
