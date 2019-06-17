export const formatPhoneNumber = phoneNumber => {
  return phoneNumber.substr(0,3) + '-' + phoneNumber.substr(3,3) + '-' +  phoneNumber.substr(6,4)
}

export const formatTimeTo12Hours = (time, hideMinutesIfZero = false) => {
  // Check correct time format and split into components
  if (time === null) return;
  const splitTime = time.split(':')
  let hours = splitTime[0]
  const mins = splitTime[1]
  const amPm = ((parseInt(hours) * 60) + parseInt(mins)) >= 720 ? 'PM' : 'AM' 
  hours = hours % 12
  if (hours === 0) {
    hours = 12
  }

  if (parseInt(mins) === 0 && hideMinutesIfZero) {
    return `${hours} ${amPm}`
  }

  return `${hours}:${mins} ${amPm}`
}