const monthsMap = new Map();
monthsMap.set("enero", "01");
monthsMap.set("febrero", "02");
monthsMap.set("marzo", "03");
monthsMap.set("abril", "04");
monthsMap.set("mayo", "05");
monthsMap.set("junio", "06");
monthsMap.set("julio", "07");
monthsMap.set("agosto", "08");
monthsMap.set("septiembre", "09");
monthsMap.set("octubre", "10");
monthsMap.set("noviembre", "11");
monthsMap.set("diciembre", "12");

const getOpinionData = ($) => {
  const title = $("h2.title").text().trim();
  const dateTime = getDateTime($(".content-time").text().trim());
  const content = getContent($);
  return { title: title, dateTime: dateTime, content: content };
};

const getDateTime = (text) => {
  text = text.split(" ");
  const day = text[0];
  const month = monthsMap.get(text[2]);
  const year = text[4];
  const hours = text[5].length === 5 ? text[5][1] + text[5][2] : "0" + text[5][1];
  const minutes =
    text[5].length === 5 ? text[5][4] + text[5][5] : text[5][3] + text[5][4];
  return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
};

const getContent = ($) => {
  const content = [];
  $(".body p").each((i, element) => {
    const text = $(element).text().trim();
    content.push(text);
  });
  if (content[content.length - 1].includes("Visítanos en nuestro Canal de")) {
    content.pop();
    content.pop();
    content.pop();
  }
  return content;
};

export { getOpinionData };