import {View,Text,Pressable,StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons"


const Btn=({children,onp,mv,mh,pv,ph,fz})=>{
    return(
       <Pressable onPress={onp} style={({pressed})=>{
        return pressed&&{opacity:0.5}
       }}>
           {children}
        </Pressable>
        
    )
}
export const Icbtn = ({onp,name,color,bgcol,mv,mh,pv,ph,br})=>{
    return(
        <Pressable onPress={onp} style={({pressed})=>{
            return [styles.icbtn,{backgroundColor:bgcol,marginVertical:mv,marginHorizontal:mh,borderRadius:br},pressed&&{opacity:0.5}]
        }}>
            <Ionicons name={name} size={30} color={color} style={[styles.icbtn,{backgroundColor:bgcol,paddingVertical:pv,paddingHorizontal:ph,borderRadius:br}]} />
        </Pressable>
    )
}
export const Ic = ({name,color,bgcol,mv,mh,pv,ph,br})=>{
    return(
        <View style={({pressed})=>{
            return [styles.icbtn,{backgroundColor:bgcol,marginVertical:mv,marginHorizontal:mh,borderRadius:br},pressed&&{opacity:0.5}]
        }}>
            <Ionicons name={name} size={30} color={color} style={[styles.icbtn,{backgroundColor:bgcol,paddingVertical:pv,paddingHorizontal:ph,borderRadius:br}]} />
        </View>
    )
}


export default Btn;

const styles = StyleSheet.create({
    icbtn:{
        // borderRadius:15,   
    }
})