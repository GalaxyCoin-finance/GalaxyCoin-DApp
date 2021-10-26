export const formatLongNumber = (n, decimals) => {
    if (!n) return 0;
    n = Number(n);
    if (n < 1e3) return +(n).toFixed(decimals);
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(decimals) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(decimals) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(decimals) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(decimals) + "T";
};