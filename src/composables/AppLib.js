export function getLogoUrl(company) {
  if (!(typeof company === "undefined") && (company != '') && (company.indexOf('http') == 0)) {
    return company
  }
  return new URL(`../assets/company-icons/${company}.jpg`, import.meta.url).href
}

export function getMinutesFromTimeString(timeString) {
  let uur = 60 * parseInt(timeString.slice(0, 2));
  let min = timeString.slice(3)
  let mins = min == "00" ? 0 : parseInt(min)
  return uur + mins
}

export function formatDate(theDate) {
  if (typeof theDate === "undefined") return ''
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return theDate != '' ? theDate.toLocaleDateString("nl-NL", options) : '';
}

export function getLocationHTMLUrl(location) {
  return new URL(`../assets/locations/${location}.html`, import.meta.url).href
}

export function createSlugForEvent(event) {
  // yyyymmdd-title
  const year = event.eventDate.getFullYear().toString();
  const month = (event.eventDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to the month because January is 0-based
  const day = event.eventDate.getDate().toString().padStart(2, '0');

  // Concatenate them in the "yyyymmdd" format
  const encodedDate = year + month + day;
  const encodedTitle = encodeURIComponent(event.titel.replace(/ /g, '-'));
  return encodedDate + '-' + encodedTitle.substring(0,25).replace(/%/g, '-')
}

export function getTagList(tags) {
  return tags.toLowerCase().split(",")
}