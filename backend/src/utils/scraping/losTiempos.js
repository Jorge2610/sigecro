const getLosTiemposData = ($) => {
  const title = $("h1").text().trim();
  const dateTime = getDateTime($(".date-publish").text().trim());
  const content = getContent($);
  return { title: title, dateTime: dateTime, content: content };
};

const getDateTime = (text) => {
  const day = text[13] + text[14];
  const month = text[16] + text[17];
  const year = text[19] + text[20] + text[21] + text[22];
  const hours = text.length === 35 ? text[30] + text[31] : "0" + text[30];
  const minutes =
    text.length === 35 ? text[33] + text[34] : text[32] + text[33];
  return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
};

const getContent = ($) => {
  const content = [];
  $(".field-items p").each((i, element) => {
    const text = $(element).text().trim();
    text.includes("Te podría interesar") ? "" : content.push(text);
  });
  return content;
};

export { getLosTiemposData };
