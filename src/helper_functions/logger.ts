const logger = {
  log: (...args: any) => {
    if (process.env.NODE_ENV === "development")
      console.log("LOG ℹ️ :: ", ...args);
  },

  warn: (...args: any) => {
    if (process.env.NODE_ENV === "development")
      console.warn("WARN ⚠️ :: ", ...args);
  },
  error: (...args: any) => {
    if (process.env.NODE_ENV === "development")
      console.log("ERROR ❌ :: ", ...args);
  },
};

export default logger;
