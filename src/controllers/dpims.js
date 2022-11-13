import axios from 'axios';
const cheerio = require('cheerio');
const _ = require('lodash');

async function dpimsService(req, res) {
  // init
  let query = '';
  const find = (search) =>
    `http://dpims.moh.gov.my/?inputString=${search}&c=&s=&Submit=Search&total=`;
  const page = (page, count, search) =>
    `http://dpims.moh.gov.my/index.php?pageNum_search_list=${page}&totalRows_search_list=${count}&inputString=${search}&c=&s=&Submit=Search&total=`;
  const { nama, pageNum, pageSize } = req.query;
  if (nama) {
    const search = nama.toUpperCase();
    query = find(search);
  }
  if (nama && pageNum && pageSize) {
    const search = nama.toUpperCase();
    query = page(pageNum, pageSize, search);
  }
  let data = [];
  let linksdata = [];
  let matches = [];
  let pages = [];
  let cleandata = {};
  // get data
  try {
    const response = await axios.get(query);
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
    const first = _.findIndex(data, (o) =>
      o.text.includes(`${nama.toUpperCase()}`)
    );
    const last = _.findLastIndex(data, (o) =>
      o.text.includes(`${nama.toUpperCase()}`)
    );
    let j = 0;
    for (let i = first; i < last + 1; i += 3) {
      cleandata = {
        ...cleandata,
        no: parseInt(data[i - 1].text),
        nama: data[i].text,
        nomborMdc: data[i + 1].text,
        link: linksdata[j].link.split('?')[1],
      };
      matches.push(cleandata);
      j++;
    }
    // last page conf
    if (matches[0].no > 20) {
      if (!linksdata[22]) {
        const lastlink = _.findLastIndex(linksdata, (o) =>
          o.link.includes('pageNum_search_list')
        );
        const allresult = linksdata[lastlink].link
          .split('&totalRows_search_list=')[1]
          .split('&')[0];
        const prevpage = linksdata[lastlink].link
          .split('pageNum_search_list=')[1]
          .split('&')[0];
        pages = [
          {
            result: parseInt(allresult),
            next: parseInt(prevpage) + 2,
            prev: parseInt(prevpage),
            endpage: parseInt(prevpage) + 2,
          },
        ];
      }
    }
    // after page 1 conf
    if (linksdata.length > 20) {
      const allresult = linksdata[21].link
        .split('&totalRows_search_list=')[1]
        .split('&')[0];
      const endpage = linksdata[21].link
        .split('pageNum_search_list=')[1]
        .split('&')[0];
      pages = [
        {
          result: parseInt(allresult),
          next: 1,
          endpage: parseInt(endpage) + 1,
        },
      ];
      if (linksdata[22]) {
        const nextpage = linksdata[22].link
          .split('pageNum_search_list=')[1]
          .split('&')[0];
        const endpage = linksdata[23].link
          .split('pageNum_search_list=')[1]
          .split('&')[0];
        pages = [
          {
            result: parseInt(allresult),
            next: parseInt(nextpage),
            prev: nextpage - 2,
            endpage: parseInt(endpage) + 1,
          },
        ];
      }
    }
  } catch (error) {
    console.error(error);
  }
  if (matches.length === 0) {
    return res
      .status(404)
      .json({ status: 'error', message: 'No matches found' });
  }
  if (matches.length > 19) {
    return res.status(200).json({
      status: 'success',
      matches: matches,
      pages: pages,
    });
  }
  if (matches.length < 20 && matches[0].no > 20) {
    return res.status(200).json({
      status: 'success',
      matches: matches,
      pages: pages,
    });
  }
  pages = [
    {
      result: matches.length,
      next: 1,
      endpage: 1,
    },
  ];
  res.status(200).json({ status: 'success', matches: matches, pages: pages });
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
