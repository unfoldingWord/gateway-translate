export default function getSha({
  item, fetchResponse, cardResourceId,
}) {
  if (cardResourceId === 'twl') {
    return fetchResponse?.data?.sha
  }

  // Each item in the items array may have a unique fetchResponse.
  return item?.fetchResponse?.data?.sha || fetchResponse?.data?.sha || null
}
