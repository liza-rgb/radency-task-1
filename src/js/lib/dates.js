export function getDatesList(content) {
    const dates = content.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g);
    if (dates) {
        return dates.join(", ");
    }
    return "";
}

export function formatDate(date) {
    const day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }

    const months = ["January", "February", "March", "April", "May", "June", "July", "August" ,"September", "October", "November", "December"];
    const month = date.getMonth();

    const year = date.getFullYear();

    return `${months[month]} ${day}, ${year}`;
}

