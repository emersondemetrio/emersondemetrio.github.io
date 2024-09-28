export const changeTime = (
  direction: "f" | "p",
  amount: number,
  type: "s" | "m" | "h",
  relativeTo: Date,
) => {
  const newDate = new Date(relativeTo);

  if (type === "h") {
    newDate.setHours(
      newDate.getHours() + (direction === "f" ? amount : -amount),
    );
  } else if (type === "m") {
    newDate.setMinutes(
      newDate.getMinutes() + (direction === "f" ? amount : -amount),
    );
  } else {
    newDate.setSeconds(
      newDate.getSeconds() + (direction === "f" ? amount : -amount),
    );
  }

  return newDate;
};

export const changeH = (amount: number, relativeTo: Date) => {
  return changeTime(amount > 0 ? "f" : "p", Math.abs(amount), "h", relativeTo);
};
