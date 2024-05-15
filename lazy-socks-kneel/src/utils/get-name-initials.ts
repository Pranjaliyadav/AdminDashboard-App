export const getNameInitials = (name: string, count = 2) => {
  console.log(
    "here name", name
  )
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const filtered = initials.replace(/[^a-zA-Z]/g, "");
  return filtered.slice(0, count).toUpperCase();
};
//return initials