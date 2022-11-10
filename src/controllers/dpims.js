import axios from 'axios';
const cheerio = require('cheerio');
const _ = require('lodash');

async function dpimsService(req, res) {
  const { nama } = req.query;
  const search = nama.toUpperCase();
  const url = `http://dpims.moh.gov.my/?inputString=${search}&c=&s=&Submit=Search&total=`;
  let data = [];
  let matches = [];
  let cleandata = {};
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const names = $('td');
    names.each((idx, el) => {
      const needed = { text: '' };
      needed.text = $(el).text();
      data.push(needed);
    });
    let dataLength = data.length;
    for (let i = 0; i < data.length; i++) {
      if (!data[i].text) {
        data.splice(i, 1);
        dataLength--;
      }
      if (data[i].text === ' ') {
        data.splice(i, 1);
        dataLength--;
      }
      if (data[i].text === ':') {
        data.splice(i, 1);
        dataLength--;
      }
      if (data[i].text.match(/^\n/)) {
        data.splice(i, 1);
        dataLength--;
      }
    }
    const first = _.findIndex(data, (o) => o.text.includes(`${search}`));
    const last = _.findLastIndex(data, (o) => o.text.includes(`${search}`));
    for (let i = first; i < last + 1; i += 3) {
      cleandata = {
        ...cleandata,
        no: data[i - 1].text,
        nama: data[i].text,
        nomborMdc: data[i + 1].text,
      };
      matches.push(cleandata);
    }
  } catch (error) {
    console.error(error);
  }
  // if (matches.length === 0) {
  //   return res
  //     .status()
  //     .json({ status: 'error', message: 'No matches found' });
  // }
  res.status(200).json({ status: 'success', matches: matches });
}

export { dpimsService };
