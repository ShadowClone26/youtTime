import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {colors, fsize} from "../constants/colors";
import Btn, {Icbtn} from "../comps/Btns";
import { extendedtimer, getremainingtime, stopwatchfun } from "../comps/Timefuns";
import { useIsFocused } from "@react-navigation/native";

// let dateobj = new Date();
// let h=0,m=0,s=0,mili=1;
let objout = new Date();
let pausedtime = new Date();
objout.setHours(0,0,0,0);
pausedtime.setHours(0,0,0,0);

let status="notset";
export default function Timer ({navigation}){
    // const [time, settime] = useState(new Date());
    const [timetoshow, settimetoshow] = useState(objout);
    const [timerh, settimerh] = useState();
    const [timerm, settimerm] = useState();
    const [timers, settimers] = useState();
    const [modalvis, setmodalvis] = useState(false);
    const [newtimervis, setnewtimervis] = useState(false);
    


    let isfc = useIsFocused();


    function showmodal() {
        setmodalvis(true);
    }


    function startnewtimer() {
        if (!timers||timers>59||timers<0) {
            Alert.alert("Error","Error in Seconds");
            return;
        }
        if (!timerm||timerm>59||timerm<0) {
            Alert.alert("Error","Error in Minutes");
            return;
        }
        if (!timerh||timerh>23||timerh<0) {
            Alert.alert("Error","Error in Hours");
            return;
        }
        let currenttime = new Date();
        objout.setHours(
            currenttime.getHours()+parseInt(timerh),
            currenttime.getMinutes()+parseInt(timerm),
            currenttime.getSeconds()+parseInt(timers),
            0,
        );
        console.log(objout.getHours(),objout.getMinutes(),objout.getSeconds(),objout.getMilliseconds(),
        );
        status="play";
        setnewtimervis(false);
        settimetoshow(new Date(objout));
    }

    
    function resetwatch() {
        status="notset";
        objout.setHours(0,0,0,0);
        settimetoshow(new Date(objout));
        settimerh();
        settimerm();
        settimers();
    }
    function startwatch() {
        status="play";
        // console.log(objout);
        let newobjout = extendedtimer(objout,pausedtime);
        // console.log(newobjout.extendedtime);
        objout=new Date(newobjout.extendedtime);
        settimetoshow(new Date(timetoshow));
        // settimetoshow();
    }
    function pausewatch() {
        status="pause";
        pausedtime = new Date();
    }
    
    useEffect(() => {
        if (status=="notset") {
            return;
        }
        if (status=="pause") {
            return;
        }
        // console.log(timerprops);
        var timerinterval = setInterval(() => {
             let remainingtime = getremainingtime(objout);
            settimetoshow(new Date(remainingtime.remainingtime));
         }, 100);
        //  var timerinterval = setInterval(() => {
        //     // settime(new Date());
        //     let newtime = stopwatchfun(objout,status);
        //     // console.log(newtime);
        //     settimetoshow(new Date(newtime.timedifference));
        // }, 100);
    
        return(()=>{
            clearInterval(timerinterval)
    })
    }, [status])
    

    
    function hidemodal() {
        console.log("presses");
    }
    function gotopage(pagename) {
        navigation.replace(pagename);
    }


    return(
        <>
          <Btn onp={showmodal}>
                <Text style={styles.currentpage}>Timer</Text>
            </Btn>
            {
                    modalvis&&
                    <Modal visible={modalvis} onRequestClose={()=>setmodalvis(false)} transparent={true} >
                    <View style={styles.optionmodalmaindiv}>
                    <Text style={[styles.options,{backgroundColor:colors.mainmedium,}]}>Timer</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"watch")}>watch</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"stopwatch")}>Stopwatch</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"events")}>Events</Text>
                    </View>
                    <Pressable onPress={()=>setmodalvis(false)} style={{flex:1,backgroundColor:colors.mainlight,opacity:0.2,zIndex:-20}}></Pressable>
                    </Modal>
                 }
        <View style={[styles.mainscreen]}>
           {!newtimervis&&
             <View style={styles.clockdiv}>
             <View style={styles.mainclockdiv}>
             <Text style={styles.hourtext}>
                     {timetoshow.getHours()<10?"0"+timetoshow.getHours():timetoshow.getHours()>12?timetoshow.getHours()-12:timetoshow.getHours()}:
                     {timetoshow.getMinutes()<10?"0"+timetoshow.getMinutes():timetoshow.getMinutes()}:
                     {timetoshow.getSeconds()<10?"0"+timetoshow.getSeconds():timetoshow.getSeconds()}:
                     {timetoshow.getMilliseconds().toString().slice(0,1)}
             </Text>
             </View>
            
             </View>
           }
            <View style={styles.controlpanel}>
                <View style={styles.stopdiv}>
                {
                (status=="pause"||status=="play")&&
                    <Icbtn color={"white"} name={"stop"} onp={resetwatch}  />
                }
                </View>
                <View style={styles.playpausediv}>
                {
                (status=="pause")&&
                    <Icbtn color={"white"} name={"play"} onp={startwatch}  />
                }
                {
                (status=="play")&&
                    <Icbtn color={"white"} name={"pause"} onp={pausewatch}  />
                } 
                </View>
               
            </View>
           {status=="notset"&&!newtimervis&&
                <Text onPress={()=>setnewtimervis(true)} style={styles.textbtn}>
                    new Timer
                </Text>
            }
            {newtimervis&&
                <Modal visible={newtimervis} onRequestClose={()=>setnewtimervis(false)} transparent={true} >
                    <View style={styles.newtimermodaldiv} >
                        <View style={styles.propsdiv}>       
                        <TextInput style={styles.props} onChangeText={(value)=>settimerh(value)} maxLength={2} keyboardType="number-pad" placeholder="Hour" />
                        <TextInput style={styles.props} onChangeText={(value)=>settimerm(value)} maxLength={2} keyboardType="number-pad" placeholder="Minutes" />
                        <TextInput style={styles.props} onChangeText={(value)=>settimers(value)} maxLength={2} keyboardType="number-pad" placeholder="Seconds" />
                        </View>
                        <Text style={styles.textbtn} onPress={startnewtimer}>Set</Text>
                        <Text style={[styles.textbtn,{backgroundColor:colors.othermedium}]} onPress={()=>setnewtimervis(false)}>Cancel</Text>
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
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"black",
        flexDirection:"column",
        zIndex:-20,
    },clockdiv:{
        flexDirection:"row",
        width:"100%",
        paddingHorizontal:15,
        marginTop:70,
    },mainclockdiv:{
        // backgroundColor:"red",
        flex:1, 
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center",
        paddingHorizontal:10,
    },hourtext:{
        fontSize:fsize.timetext,
        color:"white"
    },dividerdots:{
        fontSize:fsize.heading,
        color:"white",
        alignItems:"center",
        justifyContent:"center",
    },listtitle:{
        // backgroundColor:"blue",
        fontSize:fsize.textsmall,
        textTransform:"uppercase",
        letterSpacing:2,
        color:"white",
        opacity:0.8,
    },listtitlediv:{
        // backgroundColor:"red",
        justifyContent:"center",
        alignItems:"center",

    },itemdiv:{
        flex:1,
        // backgroundColor:"red",
        paddingVertical:10,
        flexDirection:"row",
        // justifyContent:"space-evenly",

    },itemtext:{
        // backgroundColor:"blue",
        paddingHorizontal:10,
        fontSize:fsize.headingmedium,
        letterSpacing:3,
        marginHorizontal:10,
        color:"white",
    },controlpanel:{
        // backgroundColor:"red",
        flexDirection:"row",
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        transform:[{scale:1.2}],
        marginVertical:25,

    },
    stopdiv:{
        // backgroundColor:"blue",
        marginHorizontal:5,
        padding:10,
        // transform:[{scale:1.5}]
    },playpausediv:{
        // backgroundColor:"green",
        padding:10,
        marginHorizontal:5,
        transform:[{scale:2}]

    },flagdiv:{
        // backgroundColor:"green",
        marginHorizontal:5,
        padding:10,
    },listdiv:{
        // backgroundColor:"red",
        flex:1,
        marginVertical:20,
        marginHorizontal:70,
    },mainlistdiv:{
        flex:1,
    },textbtn:{
        backgroundColor:colors.mainlight,
        paddingVertical:15,
        width:"70%",
        marginVertical:10,
        // marginHorizontal:100,
        textAlign:"center",
        borderRadius:50,
        fontSize:fsize.textmedium,
        textTransform:"uppercase",
        letterSpacing:2,
        // elevation:4,
    },currentpage:{
        position:"absolute",
        top:20,right:0,left:0,
        backgroundColor:colors.mainmedium,
        color:"black",
        marginHorizontal:50,
        textAlign:"center",
        paddingVertical:10,
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
        paddingVertical:10,
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
    },newtimermodaldiv:{
        justifyContent:"center",
        alignItems:"center",
        // backgroundColor:"white",
        position:"absolute",
        bottom:20,right:20,left:20,
        // height:200,
        // display:"flex",
        // flexDirection:"row",
        borderRadius:20,
        elevation:5,
        overflow:"hidden",
        // marginHorizontal:70,
    },propsdiv:{
        // backgroundColor:"blue",
        flexDirection:"row",
        justifyContent:"space-around",
        marginVertical:20,
    },props:{
        marginHorizontal:20,
        backgroundColor:"white",
        height:50,width:80,
        borderRadius:5,
        alignItems:"center",
        textAlign:"center",
        fontSize:17,
    }
})