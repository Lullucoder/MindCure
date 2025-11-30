export const getPreferences = async (req, res, next) => {
  try {
    return res.json({ preferences: req.user.preferences });
  } catch (error) {
    return next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const { breathingPattern, inhaleSeconds, holdSeconds, exhaleSeconds, beepEnabled } = req.body;

    if (breathingPattern) {
      req.user.preferences.breathingPattern = breathingPattern;
    }

    const updateSeconds = (field, value, min, max) => {
      if (typeof value === 'number') {
        req.user.preferences[field] = Math.min(Math.max(value, min), max);
      }
    };

    updateSeconds('inhaleSeconds', inhaleSeconds, 1, 30);
    updateSeconds('holdSeconds', holdSeconds, 0, 30);
    updateSeconds('exhaleSeconds', exhaleSeconds, 1, 30);

    if (typeof beepEnabled === 'boolean') {
      req.user.preferences.beepEnabled = beepEnabled;
    }

    await req.user.save();
    return res.json({ preferences: req.user.preferences });
  } catch (error) {
    return next(error);
  }
};
