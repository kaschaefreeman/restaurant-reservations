function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  }

function loggedIn(){
    return  getCookie('user') !==undefined
}

module.exports = {
    loggedIn, 
    getCookie
}