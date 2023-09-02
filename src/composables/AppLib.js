export function getLogoUrl(company) {
    if (!(typeof company === "undefined") && (company != '') && (company.indexOf('http') == 0)) {
      return company
    }
    return new URL(`../assets/company-icons/${company}.jpg`, import.meta.url).href
  }

export function getMinutesFromTimeString (timeString)  {
    let uur = 60 * parseInt(timeString.slice(0, 2));
    let min = timeString.slice(3)
    let mins = min == "00" ? 0 : parseInt(min)
    return uur + mins
  }
  
export function formatDate(theDate) {
  if (typeof theDate === "undefined") return ''
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return theDate!=''?theDate.toLocaleDateString("nl-NL", options):'';
}

export function getLocationHTMLUrl(location) {
  return new URL(`../assets/locations/${location}.html`, import.meta.url).href
}