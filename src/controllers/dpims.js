import axios from 'axios';
const cheerio = require('cheerio');
const _ = require('lodash');

async function dpimsService(req, res) {
  const { nama } = req.query;
  const search = nama.toUpperCase();
  const url = `http://dpims.moh.gov.my/?inputString=${search}&c=&s=&Submit=Search&total=`;
  let data = [];
  let linksdata = [];
  let matches = [];
  let cleandata = {};
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const names = $('td');
    const links = $('a');
    names.each((idx, el) => {
      const needed = { text: '' };
      needed.text = $(el).text();
      data.push(needed);
    });
    links.each((idx, el) => {
      const needed = { link: '' };
      needed.link = $(el).attr('href');
      linksdata.push(needed);
    });
    for (let i = 0; i < data.length; i++) {
      if (!data[i].text) {
        data.splice(i, 1);
      }
      if (data[i].text === ' ') {
        data.splice(i, 1);
      }
      if (data[i].text === ':') {
        data.splice(i, 1);
      }
      if (data[i].text.match(/^\n/)) {
        data.splice(i, 1);
      }
    }
    const first = _.findIndex(data, (o) => o.text.includes(`${search}`));
    const last = _.findLastIndex(data, (o) => o.text.includes(`${search}`));

    let j = 0;
    for (let i = first; i < last + 1; i += 3) {
      cleandata = {
        ...cleandata,
        no: data[i - 1].text,
        nama: data[i].text,
        nomborMdc: data[i + 1].text,
        link: linksdata[j].link.split('?')[1],
      };
      matches.push(cleandata);
      j++;
    }
  } catch (error) {
    console.error(error);
  }
  if (matches.length === 0) {
    return res
      .status(404)
      .json({ status: 'error', message: 'No matches found' });
  }
  res.status(200).json({ status: 'success', matches: matches });
}

async function dpimsInfoService(req, res) {
  const { dpims } = req.query;
  console.log(dpims);
  const url = `http://dpims.moh.gov.my/sk_public_search_info.php?${dpims}`;
  let data = [];
  let matches = [];
  let exactInfo = [];
  let cleandata = {};
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const info = $('td');
    info.each((i, el) => {
      const needed = { text: '' };
      needed.text = $(el).text();
      data.push(needed);
    });
  } catch (error) {
    console.error(error);
  }
  for (let i = 0; i < data.length; i++) {
    if (!data[i].text) {
      data.splice(i, 1);
    }
    if (data[i].text === '') {
      data.splice(i, 1);
    }
    if (data[i].text === ' ') {
      data.splice(i, 1);
    }
    if (data[i].text === ':') {
      data.splice(i, 1);
    }
    if (data[i].text.match(/^\n/)) {
      data.splice(i, 1);
    }
    const trimmed = data[i].text.replace(/^\s+|\s+$/gm, '');
    matches.push({ text: trimmed });
  }

  for (let i = 0; i < matches.length; i++) {
    _.isEmpty(matches[i].text) ? matches.splice(i, 1) : null;
  }

  const first = _.findIndex(matches, (o) => o.text.includes('Name'));
  const second = _.findIndex(matches, (o) =>
    o.text.includes('Registration No.')
  );
  const third = _.findIndex(matches, (o) =>
    o.text.includes('Date of Registration')
  );
  const fourth = _.findIndex(matches, (o) => o.text.includes('Category'));
  const fifth = _.findIndex(matches, (o) => o.text.includes('Section'));
  const sixth = _.findIndex(matches, (o) =>
    o.text.includes('Practising Address')
  );

  // uni
  const uni = `${matches[fifth + 1].text.replaceAll('           ', '')} ${
    matches[fifth + 2].text
  }`;
  // address
  const address = matches[sixth + 1].text.replace(/\n/g, ', ');
  cleandata = {
    nama: matches[first + 1].text,
    registrationNo: matches[second + 1].text,
    dateOfRegistration: matches[third + 1].text,
    category: matches[fourth + 1].text,
    qualification: uni,
    practisingAddress: address,
  };

  exactInfo.push(cleandata);
  res.status(200).json({ status: 'success', exactInfo: exactInfo });
}

export { dpimsService, dpimsInfoService };
