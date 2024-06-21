const todoDataValidation = ({ todo }) => {
  return new Promise((resolve, reject) => {
    if (!todo) reject("Todo text is missing.");
    if (typeof todo !== "string") reject("Todo is not a text");
    if (todo.length < 3 || todo.length > 100)
      reject("Todo length should be 3-100 chars only.");

    resolve();
  });
};

module.exports = todoDataValidation;
