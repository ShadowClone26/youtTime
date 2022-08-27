import { useEffect, useState } from "react";
import { Button, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {colors, fsize} from "../constants/colors";
import Btn, {Icbtn} from "../comps/Btns";
import { stopwatchfun } from "../comps/Timefuns";
import { useIsFocused } from "@react-navigation/native";

// let dateobj = new Date();
// let h=0,m=0,s=0,mili=1;
let objout = new Date();
let diffcall;
let zerotime = new Date(0);
zerotime.setHours(0,0,0,0);
let status="stop";
export default function Stopwatch ({navigation}){
    const [time, settime] = useState(new Date());
    const [timetoshow, settimetoshow] = useState(zerotime);
    const [laplist, setlaplist] = useState([]);
    const [modalvis, setmodalvis] = useState(false);



    let isfc = useIsFocused();

    function startwatch() {
        status="play";
        // console.log("hitted");
        objout=new Date();
        // settime(new Date());
        // console.log(objout);
        settime("play");
    }
    // this.setState({ lastRefresh: Date(Date.now()).toString() })

    function pausewatch() {
        
        // zerotime.setHours(timetoshow.getHours(),timetoshow.getMinutes(),timetoshow.getSeconds(),timetoshow.getMilliseconds());
        status="pause";
        let newcall=new Date();
            
        zerotime.setHours(newcall.getHours()-(newcall.getHours()-timetoshow.getHours()));
        zerotime.setMinutes(newcall.getMinutes()-(newcall.getMinutes()-timetoshow.getMinutes()));
        zerotime.setSeconds(newcall.getSeconds()-(newcall.getSeconds()-timetoshow.getSeconds()));
        zerotime.setMilliseconds(newcall.getMilliseconds()-(newcall.getMilliseconds()-timetoshow.getMilliseconds()));
        zerotime.setDate(newcall.getDate()-(newcall.getDate()-timetoshow.getDate()));


        console.log(zerotime.getSeconds());


        
        settime("pause");
    }

    function play() {
        let newcall=new Date();

        objout.setHours(newcall.getHours()-zerotime.getHours());
        objout.setMinutes(newcall.getMinutes()-zerotime.getMinutes());
        objout.setSeconds(newcall.getSeconds()-zerotime.getSeconds());
        objout.setMilliseconds(newcall.getMilliseconds()-zerotime.getMilliseconds());
        objout.setDate(newcall.getDate()-zerotime.getDate());
        status="play";
       
        
        // console.log("hitted");
        // objout=new Date();
        // settime(new Date());
        // console.log(objout);
        settime("play");
    }

    function resetwatch() {
        status="stop";
        // console.log(objout.getHours()+" "+objout.getMinutes()+" "+objout.getSeconds()+" "+objout.getMilliseconds());
        settime("stopped");
        // settimetoshow(new Date(0));
    }

    function recordlap() {
        let lapobj = timetoshow;
        setlaplist((pre)=>[...laplist,{time:lapobj}]);
    }

    function clearlist() {
        setlaplist([]);
    }
    

    useEffect(() => {
        if (!isfc) {
            return;
        }
        console.log("objout-----useff");
        console.log(objout);

        if (status=="stop") {
            zerotime.setHours(0,0,0,0);
            settimetoshow(zerotime);
            return;   
        }
        if (status=="pause") {
        
            return;
        }
        var stopwatchinterval = setInterval(() => {
                // settime(new Date());
                let newtime = stopwatchfun(objout,status);
                // console.log(newtime);
                settimetoshow(new Date(newtime.timedifference));
            }, 100);
        
        return(()=>{
                clearInterval(stopwatchinterval)
        })
    }, [status])
    // console.log("status"+status);

    function showmodal() {
        setmodalvis(true);
    }

    function renderlaps(item) {
        return(
            <View style={styles.itemdiv}>
               
                <Text style={styles.itemtext}>
                {item.index+1}
                </Text>
                <Text style={styles.itemtext}>
                {item.item.time.getHours()<10?"0"+item.item.time.getHours():item.item.time.getHours()>12?item.item.time.getHours()-12:item.item.time.getHours()}:
                    {item.item.time.getMinutes()<10?"0"+item.item.time.getMinutes():item.item.time.getMinutes()}:
                    {item.item.time.getSeconds()<10?"0"+item.item.time.getSeconds():item.item.time.getSeconds()}:
                    {item.item.time.getMilliseconds().toString().slice(0,1)}
                </Text>
            </View>
        )
    }

    
    function hidemodal() {
        console.log("presses");
    }
    function gotopage(pagename) {
        navigation.replace(pagename);
    }


    return(
        <>
          <Btn onp={showmodal}>
                <Text style={styles.currentpage}>Stopwatch</Text>
            </Btn>
            {
                    modalvis&&
                    <Modal visible={modalvis} onRequestClose={()=>setmodalvis(false)} transparent={true} >
                    <View style={styles.optionmodalmaindiv}>
                    <Text style={[styles.options,{backgroundColor:colors.mainmedium,}]}>Stopwatch</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"watch")}>watch</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"events")}>Events</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"timer")}>timer</Text>
                    </View>
                    <Pressable onPress={()=>setmodalvis(false)} style={{flex:1,backgroundColor:colors.mainlight,opacity:0.2,zIndex:-20}}></Pressable>
                    </Modal>
                 }
        <View style={[styles.mainscreen,laplist.length==0&&{justifyContent:"center"}]}>
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
            <View style={styles.controlpanel}>
                <View style={styles.stopdiv}>
                {
                (status=="pause"||status=="play")&&
                    <Icbtn color={"white"} name={"stop"} onp={resetwatch}  />
                }
                </View>
                <View style={styles.playpausediv}>
                {
                (status=="stop"||status=="pause")&&
                    <Icbtn color={"white"} name={"play"} onp={status=="stop"?startwatch:play}  />
                }
                {
                (status=="play")&&
                    <Icbtn color={"white"} name={"pause"} onp={pausewatch}  />
                } 
                </View>
                <View style={styles.flagdiv}>
                    {
                       (status=="pause"||status=="play")&&
                        <Icbtn color={"white"} name={"flag"} onp={recordlap}  />
                    }
                </View>
            </View>
            {laplist.length!=0&&<View  style={styles.mainlistdiv}>
                <View style={styles.listtitlediv}>
                    <Text style={styles.listtitle}>
                        Laps
                    </Text>
                </View>
               <View style={styles.listdiv}>
               <FlatList 
                data={laplist}
                renderItem={renderlaps}
                keyExtractor={(data,index)=>index}
                />
                </View>
            </View>}
            {laplist.length!=0&&
            <Btn onp={clearlist}>
                <Text style={styles.textbtn}>Clear list</Text></Btn>
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
        marginVertical:10,
        marginHorizontal:70,
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
    }
})