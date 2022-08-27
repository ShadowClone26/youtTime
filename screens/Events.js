import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View,Pressable, Button, TextInput, Alert, FlatList } from "react-native";
import PushNotification from "react-native-push-notification";
import Btn, { Ic, Icbtn } from "../comps/Btns";
import { colors, fsize } from "../constants/colors";

export function Events({navigation}) {
    const [modalvis, setmodalvis] = useState(false);
    const [eventlist, seteventlist] = useState([]);
    const [addneweventmodalvis, setaddneweventmodalvis] = useState(false);
    const [eventname, seteventname] = useState("");
    const [eventdate, seteventdate] = useState("");
    const [eventh, seteventh] = useState("");
    const [eventm, seteventm] = useState("");
    
    
    function showmodal() {
        setmodalvis(true);
    }

    function gotopage(pagename) {
        navigation.replace(pagename);
    }

    function settimeinformate(format) {
        if (format=="pm") {
            if (eventh<=11) {
                seteventh((parseInt(eventh)+12).toString());
                return;
            }else{
                return;
            }
        }else{
            if (eventh>11) {
                seteventh("11");
                return;
            }else{
                return;
            }
        }
    }

    function addnewevent() {
        if (!eventdate||!eventname) {
            Alert.alert("Not allowed","Enter atleast name and date");
            return;
        }
        if (!eventh) {
            seteventh("0");
        }
        if (!eventm) {
            seteventm("0");
        }
        // console.log(`${parseInt(eventh)}-${parseInt(eventm)}`);
        // return;
        let dateobj = new Date(`${eventdate.slice(6,eventdate.length)}-${eventdate.slice(3,5)}-${eventdate.slice(0,2)}`);
        dateobj.setHours(parseInt(eventh),parseInt(eventm),0,0);
        // console.log(dateobj);
        let today = new Date();
        if (dateobj<today) {
            Alert.alert("Invalid Input","Enter proper date");
            console.log("not allowed");
            // console.log((today-dateobj)<12*60*60*1000);
            return;
        }
        if (dateobj-today>2*366*24*60*60*1000) {
            Alert.alert("Not valid","Please enter date within 2 years")
        }
        let newarr=[];
        newarr=eventlist.length!=0?[...eventlist,{
            title:eventname,
            date:new Date(dateobj),
            eventh,eventm
        }]:[{
            title:eventname,
            date:new Date(dateobj),
            eventh,eventm
        }]
        eventlist.length!=0?seteventlist((pre)=>[...pre,{
            title:eventname,
            date:new Date(dateobj),
            eventh,eventm
        }]):seteventlist([{
            title:eventname,
            date:new Date(dateobj),
            eventh,eventm
        }])
        
        storetolocal(newarr);
        
        PushNotification.localNotificationSchedule({
            channelId:"eventsnotifications",
            title:eventname,
            date:new Date(dateobj),
            message:`its ${eventdate} today !!`,
        })

        // let storetasks = await
        setaddneweventmodalvis(false);
        seteventname("");
        seteventm("");
        seteventh("");
        seteventdate("");
        // Alert.alert("details",`${eventname}\n${eventdate}\n${eventm}\n${eventh}\n`)
    }

   async function storetolocal(newarr) {
    // console.log(newarr);
    let eventlistjson = JSON.stringify(newarr);
    // console.log(typeof(eventlistjson));
    // return;
        let deleteoldtask = await AsyncStorage.removeItem("eventlist");
        try {
            let storetask = await AsyncStorage.setItem("eventlist",eventlistjson);
        // console.log(eventlistjson); 
        if (!!storetask) {
            console.log("stored");
        }
        } catch (error) {
            console.log(error);
        }

    }

    async function getfromlocal() {
        let storetask = await AsyncStorage.getItem("eventlist");
        if (!!storetask) {
            // console.log("get task");
            // console.log(storetask);
        }
        if (!storetask||storetask.length==0) {
          return;
        }
        let eventlistjson = JSON.parse(storetask);
        seteventlist([...eventlistjson]);
    }

    useEffect(() => {
        getfromlocal();
        // console.log("arr");
        // console.log(arr);
    }, [])
    

    useEffect(() => {
        if (eventdate.length==2||eventdate.length==5) {
            seteventdate((pre)=>pre.concat("/"));
            return;
        }
    }, [eventdate])

    useEffect(() => {
        if (parseInt(eventh)>23) {
            seteventh("23");
            return;
        }
        if (parseInt(eventm)>59) {
            seteventm("59");
            return;
        }
    }, [eventh,eventm])
    

    function changefield(field,value) {
        switch (field) {
            case "name":seteventname(value);
                break;
            case "date":
                seteventdate(value);
                break;
            case "h":seteventh(value);
                break;
            case "m":seteventm(value);
                break;                
        
            default:
                break;
        }
    }

    function getnoti() {
        console.log("hitted notification");
        let dateobj = new Date();
        
        PushNotification.localNotificationSchedule({
            channelId:"eventsnotifications",
            date:new Date(Date.now() + 60 * 10),
            title:"trial",
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false

  /* Android Only Properties */
            repeatTime: 1,message:"hello"
        })
    }

    function delevent(title) {
        console.log(title);
        PushNotification.getScheduledLocalNotifications((noti)=>{
            for (let i = 0; i < noti.length; i++) {
                if (noti[i].title==title) {
                    console.log("found at" + i);
                    PushNotification.cancelLocalNotification(noti[i]);
                }
            }
        });
        let arr=[];
        eventlist.filter((item)=>{
            if (item.title!=title) {
                arr.push(item);
            }
        });
        seteventlist([...arr]);

        storetolocal([...arr]);
    }

    function renderevents(item) {
        let today = new Date();
        let dateobj = new Date(item.item.date)
        return(
            <View style={[styles.itemdiv,dateobj<today&&{opacity:0.9}]}>
                <View style={[dateobj<today&&{opacity:0.5}]}>
                <Text style={styles.itemname}>{item.item.title}</Text>
                <View style={styles.itemtimediv}>
                <Text style={styles.itemdate}>{dateobj.getDate()}-{dateobj.getMonth()}-{dateobj.getFullYear()}</Text>
                {!!item.item.eventm&&
                    <Text style={styles.itemtime}>{item.item.eventh}:{item.item.eventm}</Text>
                }
                </View>
                </View>
                <Icbtn name={"trash"} ph={10} onp={delevent.bind(this,item.item.title)} color={colors.mainmedium} />
            </View>

        )
    }

    // useEffect(() => {
     
    // }, [])
    

    return(
        <>
          <Btn onp={showmodal}>
                <Text style={styles.currentpage}>Events</Text>
            </Btn>
            {
                    modalvis&&
                    <Modal visible={modalvis} onRequestClose={()=>setmodalvis(false)} transparent={true} >
                    <View style={styles.optionmodalmaindiv}>
                    <Text style={[styles.options,{backgroundColor:colors.mainmedium,}]}>Events</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"watch")}>watch</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"stopwatch")}>Stopwatch</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"timer")}>Timer</Text>
                    </View>
                    <Pressable onPress={()=>setmodalvis(false)} style={{flex:1,backgroundColor:colors.mainlight,opacity:0.2,zIndex:-20}}></Pressable>
                    </Modal>
                 }
        <View style={styles.mainscreen}>
            <Text style={styles.heading}>
                Event page
            </Text>
            <Btn  onp={()=>setaddneweventmodalvis(true)}>
                <View style={styles.textbtndiv}>
                <Ic name={"add"} color={"black"} pv={5} br={50} />
                <Text style={styles.btntext}>new Event</Text>
                </View>
            </Btn>
            {eventlist.length==0&&
                <View style={styles.alerdiv}>
                    <Text style={styles.alerttext}>
                        No Events yet, add new ..
                    </Text>
                </View>
            }
            {
                eventlist.length!=0&&
                <View style={styles.eventlistdiv}>
                    <FlatList
                    data={eventlist}
                    renderItem={renderevents}
                    keyExtractor={(item,index)=>index}
                    />
                </View>
            }
            {addneweventmodalvis&&
                <Modal visible={addneweventmodalvis} onRequestClose={()=>setaddneweventmodalvis(false)} transparent={true} animationType="slide" >
                    <View style={styles.neweventmodaldiv}>
                        <Text style={styles.modalheading}>add new Event</Text>
                        <View style={styles.eventnameinputdiv}>
                            <Text style={styles.eventname}>
                                Event name
                            </Text>
                            <TextInput 
                            style={styles.eventnameinput}
                            placeholder="Enter your title here" onChangeText={changefield.bind(this,"name")} value={eventname} />
                        </View>
                        <View style={styles.eventnameinputdiv}>
                            <Text style={styles.eventname}>
                                Event date
                            </Text>
                            <TextInput 
                            style={styles.eventnameinput}
                            placeholder="DD/MM/YYYY" maxLength={10} keyboardType="number-pad" onChangeText={changefield.bind(this,"date")} value={eventdate}  />
                        </View>
                        <View style={styles.eventnameinputdiv}>
                            <Text style={styles.eventname}>
                                Event time
                            </Text>
                            <View style={styles.eventtimediv}>
                            <TextInput 
                            style={styles.eventtime}
                            placeholder="HH" keyboardType="number-pad" onChangeText={changefield.bind(this,"h")} value={eventh} />
                            <Text style={{fontSize:fsize.headingsmall}}>:</Text>
                            <TextInput 
                            style={styles.eventtime}
                            placeholder="MM" keyboardType="number-pad" onChangeText={changefield.bind(this,"m")} value={eventm} />
                            <View style={styles.ampmdiv}>
                                <Text style={[styles.ampm,eventh<12&&styles.selected]} onPress={settimeinformate.bind(this,"am")}>
                                    AM
                                </Text>
                                <Text style={[styles.ampm,eventh>11&&styles.selected]} onPress={settimeinformate.bind(this,"pm")}>
                                    PM
                                </Text>
                            </View>
                            
                            </View>
                            <Btn onp={addnewevent}>
                                <Text style={styles.setbtn}>
                                Set
                                </Text>
                            </Btn>
                            <Btn onp={()=>setaddneweventmodalvis(false)}>
                                <Text style={[styles.setbtn,{color:colors.othermedium}]}>
                                cancel
                                </Text>
                            </Btn>
                        </View>
                    </View>
                </Modal>
            }
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    mainscreen:{
        flex:1,
        // justifyContent:"center",
        // alignItems:"center",
        backgroundColor:"black",
        // flexDirection:"column",
        zIndex:-20,
        paddingTop:100,
    },currentpage:{
        position:"absolute",
        top:20,right:0,left:0,
        backgroundColor:colors.mainmedium,
        color:"black",
        marginHorizontal:50,
        textAlign:"center",
        paddingVertical:5,
        borderRadius:10,
        letterSpacing:2,
        textTransform:"uppercase"
        // zIndex:20,
    },optionmodalmaindiv:{
        backgroundColor:colors.mainlight,
        position:"absolute",
        top:15,right:50,left:50,
        borderRadius:10,
        paddingHorizontal:15,
        paddingVertical:5,
        alignItems:"center",
    },options:{
        // backgroundColor:"blue",
        textTransform:"uppercase",
        letterSpacing:2,
        color:"black",
        width:"100%",
        textAlign:"center",
        borderRadius:10,
        paddingVertical:5,
    },heading:{
        color:"white",
        fontSize:fsize.heading,
        // backgroundColor:"red",
        marginHorizontal:20,
        paddingHorizontal:10,
    },textbtndiv:{
        backgroundColor:"white",
        flexDirection:"row",
        borderRadius:50,
        alignItems:"center",
        justifyContent:"center",
        paddingHorizontal:15,
        // marginHorizontal:15,
        position:"absolute",
        top:-35,right:10,
    },btntext:{
        color:"black",
        fontSize:12,
        textTransform:"uppercase",
        letterSpacing:1,
    },alerdiv:{
        // backgroundColor:"blue",
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },alerttext:{
        // backgroundColor:"red",
        color:"white",
        fontSize:16,
        letterSpacing:2,
    },neweventmodaldiv:{
        backgroundColor:colors.mainlight,position:"absolute",
        bottom:10,right:40,left:40,
        borderRadius:15,
        overflow:"hidden",
        paddingVertical:10,
        paddingHorizontal:10,
        alignItems:"center",
        justifyContent:"center",
    },modalheading:{
        // backgroundColor:"blue",
        fontSize:fsize.headingsmall,
        color:"black",
        textTransform:"capitalize",
        letterSpacing:1,
        marginVertical:10,
        
    },eventnameinputdiv:{
        // backgroundColor:"blue",
        marginVertical:5,
        width:"90%",
        // marginHorizontal:30,
        
    },eventname:{
        // backgroundColor:"green",
        fontSize:fsize.textsmall,
        textTransform:"uppercase",
        color:"black",
        marginHorizontal:20,
        letterSpacing:1,
        opacity:0.7,
    },eventnameinput:{
        color:"black",
        backgroundColor:colors.mainmedium,
        paddingHorizontal:10,
        paddingVertical:5,
        // borderBottomWidth:1,
        borderRadius:10,
        marginHorizontal:10,
        letterSpacing:2,
        fontSize:fsize.textmedium,
        // borderBottomColor:"black"
    },eventtimediv:{
        flexDirection:"row",
        alignItems:"center",
    },eventtime:{
        color:"black",
        backgroundColor:colors.mainmedium,
        paddingHorizontal:10,
        paddingVertical:5,
        // borderBottomWidth:1,
        borderRadius:10,
        marginHorizontal:10,
        marginVertical:10,
        flex:1,
        textAlign:"center",
    },setbtn:{
        // backgroundColor:"black",
        // marginVertical:5,
        marginHorizontal:15,
        paddingVertical:10,
        color:"black",
        textAlign:"center",
        letterSpacing:2,
        textTransform:"uppercase",
        borderRadius:10,
        fontSize:fsize.textmedium
    },eventlistdiv:{
        // backgroundColor:"red",
        paddingVertical:15,
        marginVertical:10,
    },itemdiv:{
        flexDirection:"row",
        backgroundColor:"white",
        marginHorizontal:30,
        marginVertical:5,
        paddingHorizontal:10,
        paddingVertical:10,
        borderRadius:7,
        paddingLeft:20,
        justifyContent:"space-between",
        alignItems:"center",
    },itemname:{
        // backgroundColor:"coral",
        color:"black",
        fontSize:fsize.textlarge,
        paddingVertical:3,
    },itemtimediv:{
        flexDirection:"row",
        justifyContent:"flex-start"
    },itemdate:{
        // backgroundColor:"pink",
        fontSize:fsize.textmedium,
        letterSpacing:2,
        color:colors.mainmedium,

    },itemtime:{
        backgroundColor:colors.mainmedium,
        fontSize:fsize.textmedium,
        letterSpacing:1,
        paddingHorizontal:10,
        marginHorizontal:10,
        borderRadius:10,
    },ampmdiv:{
        // backgroundColor:"red",
        paddingHorizontal:5,
        justifyContent:"center",
        alignItems:"center",
        // marginVertical:2,
    },ampm:{
        // backgroundColor:"Red",
        marginVertical:2,
        fontSize:fsize.textsmall,
    },selected:{
        // backgroundColor:"black",
        color:colors.mainmedium,
        paddingHorizontal:5,
        letterSpacing:1,
        borderRadius:50,
    }
})