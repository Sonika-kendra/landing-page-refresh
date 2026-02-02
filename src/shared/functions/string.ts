export const permalink = (title: string): string => {
  title = title.toLowerCase();
  /* Remove unwanted characters, only accept alphanumeric and space */
  title = title.replace(/[^A-Za-z0-9 ]/g, "");
  /* Replace multi spaces with a single space */
  title = title.replace(/\s{2,}/g, " ");
  /* Replace space with a '-' symbol */
  return title.replace(/\s/g, "-");
};

export const getInitials = (value: string): string => {
  if (!value) return "";

  const names: string[] = value.trim().split(" ");
  let initials: string = names[0].charAt(0).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].charAt(0).toUpperCase();
  }

  return initials;
};

export const toTitleCase = (str: string, disable?: boolean): string => {
  if (disable) return str;

  return str.replace(/\w\S*/g, (txt: string) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
