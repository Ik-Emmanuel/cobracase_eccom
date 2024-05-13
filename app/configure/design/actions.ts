"use server"; 
import { db } from "@/db";
import {CaseColors, CaseFinish, CaseMaterial, PhoneModel, } from "@prisma/client"
// a remote procedure call RPC



export type SaveConfigArgs = {
    color: CaseColors, 
    finish: CaseFinish,
    material: CaseMaterial, 
    model: PhoneModel, 
    configId?: string | undefined
}

export async  function saveConfig({ color , finish , material, model, configId}: {
    color: CaseColors, 
    finish: CaseFinish,
    material: CaseMaterial, 
    model: PhoneModel, 
    configId?: string | undefined
}){

    await db.configuration.update({
        where: {
            id: configId
        }, 
        data:{
            color, finish, material, model
        }
    })

}