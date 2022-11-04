export function randomLetters (n) {
    const s = "abcdefghijklmnopqrstuvwxyz";
    const result = Array(n).join()
      .split(',')
      .map(function() { 
        return s.charAt(Math.floor(Math.random() * s.length)); }
      ).join('');
    return result;
  }
  