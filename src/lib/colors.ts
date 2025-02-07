// Định nghĩa các màu dùng chung
export const CARD_COLORS = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-red-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-indigo-100",
  "bg-orange-100",
  "bg-teal-100",
  "bg-cyan-100",
] as const;

// Hàm lấy màu ngẫu nhiên
export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * CARD_COLORS.length);
  return CARD_COLORS[randomIndex];
};

// Hàm lấy màu dựa trên id/text để màu không thay đổi mỗi lần render
export const getConsistentColor = (key: string | number) => {
  const index =
    Math.abs(
      String(key)
        .split("")
        .reduce((acc, char) => {
          return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0)
    ) % CARD_COLORS.length;
  return CARD_COLORS[index];
};
