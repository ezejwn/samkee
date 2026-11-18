// 예약 실행 — 30분마다 삼기에너지솔루션즈 기사(네이버 증권)와 공시(DART·네이버 증권)를 수집해 누적
// 일정은 netlify.toml의 [functions."news-collect"] schedule에서 정합니다.

const news = require("../lib/newsfeed");
const dart = require("../lib/disclosures");
const fin = require("../lib/financials");

exports.handler = async function (event) {
  const out = {};
  // 공시를 먼저: 첫 실행 때 DART 고유번호를 찾아 저장해야 재무제표 수집이 시작됨
  try { out.disclosures = await dart.collect(dart.getStore(event)); } catch (e) { out.disclosures = { error: String(e.message || e) }; }
  try { out.news = await news.collect(news.getStore(event)); } catch (e) { out.news = { error: String(e.message || e) }; }
  try { out.financials = await fin.collect(fin.getStore(event), { maxCalls: 3, deadline: Date.now() + 8000, timeout: 12000, event }); } catch (e) { out.financials = { error: String(e.message || e) }; }
  for (const k in out) { delete out[k]._arc; delete out[k]._fin; }
  console.log("news-collect", JSON.stringify(out));
  return { statusCode: 200, body: JSON.stringify(out) };
};
