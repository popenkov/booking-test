import fs from "fs";
import * as cheerio from "cheerio";

const $ = cheerio.load(fs.readFileSync("./scheme-initial.svg", "utf8"), {
  xmlMode: true,
});

// все элементы места
const elements = $('g[id^="P"]');

// Replace the elements
elements.each(function () {
  const placeid = $(this).attr("id").slice(1);
  // todo проверить, не везде есть нужные атрибуты
  const place = parseInt(placeid.split("_")[0] || placeid, 10);

  const seactorAndRowId = $(this).parent()[0].attribs.id;
  const sector = seactorAndRowId.split("R")[0].slice(1);
  const row = seactorAndRowId.split("R")[1];

  const circle = $(this).children()[0];
  const xPosition = circle.attribs.cx;
  const yPosition = circle.attribs.cy;

  // удалить существующий элемент
  $(this).empty();

  // добавить вместо него элемент с нужными атрибутами и версткой
  $(this).attr("id", `${sector}-${row}-${place}`);
  $(this).attr("class", "sector__row-place js-place-wrapper");
  $(this).attr("data-sector", sector);
  $(this).attr("data-row", row);
  $(this).attr("data-place", place);

  // Add the SVG elements
  const svg = $('<g class="sector__row-svg js-place"></g>');
  svg.append(
    `<circle class="sector__place" id="circle-1" cx="${xPosition}" cy="${yPosition}" r="12" fill="currentColor" />`,
  );
  svg.append(
    `<circle class="sector__place-hole" cx="${xPosition}" cy="${yPosition}" r="3" fill="white" draggable="false" />`,
  );
  $(this).append(svg);

  // Добавить текст
  $(this).append(
    `<text class="text js-seat-text-number" x="${xPosition}" y="${yPosition}" text-anchor="middle" dominant-baseline="middle">${place}</text>`,
  );
  $(this).append(
    `<text class="text js-seat-text-sold hidden" x="${yPosition}" y="${xPosition}" text-anchor="middle" dominant-baseline="middle">₽</text>`,
  );

  // добавить место
  const freeSeat = $('<g class="js-seat-free hidden"></g>');
  freeSeat.append('<line x1="1.35355" y1="0.646447" x2="18.3536" y2="17.6464" stroke="white"/>');
  freeSeat.append(
    '<line y1="-0.5" x2="24.0416" y2="-0.5" transform="matrix(-0.707107 0.707107 0.707107 0.707107 18 1)" stroke="white"/>',
  );
  freeSeat.attr(
    "style",
    `transform: translate(calc(${xPosition}px - 9px), calc(${yPosition}px - 9px));`,
  );
  $(this).append(freeSeat);

  // Добавить фон
  $(this).append(
    `<rect class="sector__place-background" width="44" height="44" style="transform: translate(calc(${xPosition}px - 22px), calc(${yPosition}px - 22px));" />`,
  );
});

const dancefloorPlace = $("#dancefloor");

const updateDancefloorPlace = () => {
  console.log(dancefloorPlace);
  const circle = dancefloorPlace.children()[0];
  const xPosition = circle.attribs.cx;
  const yPosition = circle.attribs.cy;

  // удалить существующий элемент
  dancefloorPlace.empty();

  // добавить вместо него элемент с нужными атрибутами и версткой
  dancefloorPlace.attr("id", `dancefloor`);
  dancefloorPlace.attr("class", "client-place client-place--dancefloor js-place-dancefloor");
  dancefloorPlace.attr("data-sector", "dancefloor");
  dancefloorPlace.attr("data-row", "dancefloor");
  dancefloorPlace.attr("data-place", "dancefloor");

  // Add the SVG elements
  const svg = $('<g class="client-place__svg js-place"></g>');
  svg.append(
    `<circle class="client-place__svg-place" id="circle-1" cx="${xPosition}" cy="${yPosition}" r="24" fill="currentColor" />`,
  );
  // svg.append(
  //   `<circle class="client-place__svg-hole" cx="${xPosition}" cy="${yPosition}" r="3" fill="white" draggable="false" />`,
  // );
  dancefloorPlace.append(svg);

  // // Добавить текст
  dancefloorPlace.append(
    `<text class="text--large js-seat-text-number" x="${Number(xPosition) + 250} " y="${yPosition}" text-anchor="middle" dominant-baseline="middle">Купить билет на танцпол</text>`,
  );
  // dancefloorPlace.append(
  //   `<text class="text js-seat-text-sold hidden" x="${yPosition}" y="${xPosition}" text-anchor="middle" dominant-baseline="middle">₽</text>`,
  // );

  // // добавить место
  // const freeSeat = $('<g class="js-seat-free hidden"></g>');
  // freeSeat.append('<line x1="1.35355" y1="0.646447" x2="18.3536" y2="17.6464" stroke="white"/>');
  // freeSeat.append(
  //   '<line y1="-0.5" x2="24.0416" y2="-0.5" transform="matrix(-0.707107 0.707107 0.707107 0.707107 18 1)" stroke="white"/>',
  // );
  // freeSeat.attr(
  //   "style",
  //   `transform: translate(calc(${xPosition}px - 9px), calc(${yPosition}px - 9px));`,
  // );
  // dancefloorPlace.append(freeSeat);

  // Добавить фон
  dancefloorPlace.append(
    `<rect class="sector__place-background" width="44" height="44" style="transform: translate(calc(${xPosition}px - 22px), calc(${yPosition}px - 22px));" />`,
  );
};

if (dancefloorPlace) {
  updateDancefloorPlace();
}

// сохранение
const output = $.html();
fs.writeFileSync("output.svg", output);
