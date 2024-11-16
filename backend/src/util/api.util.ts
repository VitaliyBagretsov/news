import fetch from "node-fetch";

export const getHtmlByFetch = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "text/html",
    },
  });

  const html = await response.text();
  return html;
};
