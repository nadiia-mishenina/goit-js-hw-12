import axios from 'axios';
import { MESSAGES, MESSAGES_BG_COLORS, showInfoMessage } from './helpers';
import { fetchLoader } from './render-functions';

const API_KEY = '52967670-3351bf06a7f07a2e608e7cced';
const API_URL = 'https://pixabay.com/api/';

const BASE_CONFIG = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 15,
};

export async function getGalleryData(queryValue, page = 1) {
  try {
    fetchLoader();

    const params = {
      ...BASE_CONFIG,
      q: queryValue,
      page,
    };

    const response = await axios.get(API_URL, { params });

    if (response.data.totalHits === 0) {
      showInfoMessage(MESSAGES.noResults, MESSAGES_BG_COLORS.yellow);
    }

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

function handleAxiosError(error) {
  if (error.response) {
    const { data, status } = error.response;
    showInfoMessage(
      `${MESSAGES.exception} (Status ${status}) ERROR: ${data}`,
      MESSAGES_BG_COLORS.orange
    );
  } else if (error.request) {
    showInfoMessage(
      `${MESSAGES.exception} No response received from server.`,
      MESSAGES_BG_COLORS.orange
    );
  } else {
    showInfoMessage(
      `${MESSAGES.exception} ${error.message}`,
      MESSAGES_BG_COLORS.orange
    );
  }
}
