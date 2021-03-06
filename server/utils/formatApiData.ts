import slugify from 'slugify';
import { ProvinceStatistic } from '../../models/ProvinceStatistic';
import { VietnamStatistic } from '../../models/VietnamStatistic';
import { ProvinceByDay } from '../../models/ProvinceByDay';

export const formatDate = (data: string) => {
  const splitData = data.split('/');
  return `${
    parseInt(splitData[0], 10) < 10 ? '0' + splitData[0] : splitData[0]
  }-${
    parseInt(splitData[1], 10) < 10 ? '0' + splitData[1] : splitData[1]
  }-2021`;
};

const formatDateApi = (data: string) => {
  const dateString = data.split('"')[1];
  const splitData = dateString.split('/');
  return `${
    parseInt(splitData[0], 10) < 10 ? '0' + splitData[0] : splitData[0]
  }-${parseInt(splitData[1], 10) < 10 ? '0' + splitData[1] : splitData[1]}`;
};

const toNumber = (value: string) => {
  try {
    return parseInt(value.split('"')[1]) || 0;
  } catch (e) {
    return 0;
  }
};

export const formatVnExpressData = (data: string) => {
  const lines = data.split('\n');
  const result: VietnamStatistic[] = [];

  lines.forEach((line, index) => {
    if (index > 0) {
      const lineData = line.split(',');
      if (!toNumber(lineData[9])) return;
      const newItem = {
        date: formatDateApi(lineData[0]),
        newDomesticConfirmed: toNumber(lineData[1]),
        totalDomesticConfirmed: toNumber(lineData[2]),
        blockadeConfirmed: toNumber(lineData[3]),
        communityConfirmed: toNumber(lineData[4]),
        importedConfirmed: toNumber(lineData[5]),
        newDeaths: toNumber(lineData[6]),
        newRecovered: toNumber(lineData[7]),
        newConfirmed: toNumber(lineData[8]),
        newCuring: toNumber(lineData[20]),
        totalConfirmed: toNumber(lineData[9]),
        totalDeaths: toNumber(lineData[10]),
        totalRecovered: toNumber(lineData[11]),
        totalCuring: toNumber(lineData[21]),
        vaccineFund: toNumber(lineData[12]),
        newDonation: toNumber(lineData[13]),
        totalConfirmed2020: toNumber(lineData[22]),
        totalDeaths2020: toNumber(lineData[23]),
        totalRecovered2020: toNumber(lineData[24]),
      };

      result.push(newItem);
    }
  });
  return result;
};

export const formatVnExpressProvinceData = (data: string) => {
  const lines = data.split('\n');
  const result: ProvinceStatistic[] = [];

  lines.forEach((line, index) => {
    if (index > 0) {
      const lineData = line.split(',');
      const id = toNumber(lineData[0]);
      if (id !== 46 && Boolean(lineData[2])) {
        const newItem = {
          id,
          name: lineData[2].split('"')[1],
          confirmed: toNumber(lineData[3]),
          newConfirmed: toNumber(lineData[4]),
          deaths: toNumber(lineData[20]),
        };
        result.push(newItem);
      }
    }
  });

  return result;
};

export const formatProvinceByDayVnExpressData = (data: string) => {
  const lines = data.split('\n');
  const result: ProvinceByDay[] = [];
  lines.forEach((line, index) => {
    if (index === 0) {
      const provinces = line.split(',');
      provinces.forEach((province, i) => {
        if (i >= 1 && i <= 62) {
          const provinceName = province.split('"')[1];
          result.push({
            name: provinceName,
            slug: slugify(provinceName.toLowerCase()),
            data: [],
          });
        }
      });
    }
    if (index >= 2) {
      const cases = line.split(',');
      const rawDate = cases[0].split('"')[1];
      if (rawDate) {
        const rawDateSplit = rawDate.split('/');
        const date = `${
          parseInt(rawDateSplit[0], 10) < 10
            ? '0' + parseInt(rawDateSplit[0], 10)
            : parseInt(rawDateSplit[0], 10)
        }-${
          parseInt(rawDateSplit[1], 10) < 10
            ? '0' + parseInt(rawDateSplit[1], 10)
            : parseInt(rawDateSplit[1], 10)
        }`;
        result.forEach((item, i) => {
          item.data.push({
            date,
            confirmed: parseInt(cases[i + 1].split('"')[1] || '0', 10),
          });
        });
      }
    }
  });
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
};
