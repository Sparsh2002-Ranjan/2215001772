export const fetchNumbers = async (numberType) => {
    try {
      const response = await fetch(`/numbers/${numberType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch numbers');
      }
      return response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };
  