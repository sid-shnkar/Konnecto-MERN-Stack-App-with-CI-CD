/*
This is a utility function defined in the getTimeDiff.tsx file.
The function calculates the time difference between the current date/time and a given createdAt date/time.

The function takes a createdAt parameter of type string, representing the timestamp of a message or event.

1. Function Definition:
*/
const getTimeDiff = (createdAt: string) => {
  // Create Date objects for the current date and the message's createdAt date
  const currentDate = new Date();
  const messageDate = new Date(createdAt);

  // Calculate the time difference in milliseconds, minutes, hours, and days
  const diffInMs = currentDate.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Determine the appropriate time format based on the time difference
  if (diffInMinutes < 60) {
    // If the difference is less than 60 minutes, return the minutes ago format
    return diffInMinutes === 0
      ? "now"
      : `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  } else if (diffInHours < 24) {
    // If the difference is less than 24 hours, return the hours ago format
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  } else {
    // If the difference is equal to or greater than 24 hours, return the days ago format
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }
};

// Export the getTimeDiff function as the default export of the module
export default getTimeDiff;
