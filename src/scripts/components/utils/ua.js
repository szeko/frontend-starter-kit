export function getIEVersion () {
  const { userAgent } = window.navigator;

  const msie = userAgent.indexOf('MSIE ');
  if (msie > 0) {
    return parseInt(userAgent.substring(msie + 5, userAgent.indexOf('.', msie)), 10);
  }

  const trident = userAgent.indexOf('Trident/');
  if (trident > 0) {
    const rv = userAgent.indexOf('rv:');
    return parseInt(userAgent.substring(rv + 3, userAgent.indexOf('.', rv)), 10);
  }

  const edge = userAgent.indexOf('Edge/');
  if (edge > 0) {
    return parseInt(userAgent.substring(edge + 5, userAgent.indexOf('.', edge)), 10);
  }

  return false;
}

export function isIE () {
  return getIEVersion() !== false;
}

export function isIOS () {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function isSafari () {
  return /^((?!chrome).)*safari/i.test(navigator.userAgent);
}

export function isSafariDesktop () {
  return isSafari() && !isIOS();
}

export function isSafariMobile () {
  return isSafari() && isIOS();
}
