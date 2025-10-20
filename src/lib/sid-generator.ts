const generateSessionId = (): string => {
  const sid = crypto.randomUUID();
  return sid;
};

export { generateSessionId };
