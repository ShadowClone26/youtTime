export function stopwatchfun(time,status) {
    // console.log(zerotime);
    var oldtime = time;
    var status = status;
    var currentime = new Date();
    let hourdiff = currentime.getHours()-oldtime.getHours();
    let mindiff = currentime.getMinutes()-oldtime.getMinutes();
    let secdiff = currentime.getSeconds()-oldtime.getSeconds();
    let milidiff = currentime.getMilliseconds()-oldtime.getMilliseconds();
    let timedifference=new Date(0);
    timedifference.setHours(hourdiff);
    timedifference.setMinutes(mindiff);
    timedifference.setSeconds(secdiff);
    timedifference.setMilliseconds(milidiff);
    // timedifference.setDate(0);

    return {
        timedifference:timedifference,
        status:status
    }

}

export function getremainingtime(goaltime) {
    // console.log("goaltime");
    // console.log(goaltime);
    let currenttime = new Date();
    let remainingtime = new Date();
    let hourdiff = goaltime.getHours()-currenttime.getHours();
    let mindiff = goaltime.getMinutes()-currenttime.getMinutes();
    let secdiff = goaltime.getSeconds()-currenttime.getSeconds();
    let milidiff = goaltime.getMilliseconds()-currenttime.getMilliseconds();
    remainingtime.setHours(hourdiff);
    remainingtime.setMinutes(mindiff);
    remainingtime.setSeconds(secdiff);
    remainingtime.setMilliseconds(milidiff);
    // remainingtime.setHours(
    //     goaltime.getHours()-currenttime.getHours(),
    //     goaltime.getMinutes()-currenttime.getMinutes(),
    //     goaltime.getSeconds()-currenttime.getSeconds(),
    //     goaltime.getMilliseconds()-currenttime.getMilliseconds(),
    // );
    return {
        remainingtime:remainingtime
    };
}

export function extendedtimer(goaltime,pausedtime) {
    let currentime = new Date();
    let extendedtime = new Date();
    let newgoaltime = new Date();
    extendedtime.setHours(
        currentime.getHours()-pausedtime.getHours(),
        currentime.getMinutes()-pausedtime.getMinutes(),
        currentime.getSeconds()-pausedtime.getSeconds(),
        currentime.getMilliseconds()-pausedtime.getMilliseconds(),
    );
    // console.log(extendedtime);
    newgoaltime.setHours(
        goaltime.getHours()+extendedtime.getHours(),
        goaltime.getMinutes()+extendedtime.getMinutes(),
        goaltime.getSeconds()+extendedtime.getSeconds(),
        goaltime.getMilliseconds()+extendedtime.getMilliseconds(),
    );
    return {
        extendedtime:newgoaltime
    }
}