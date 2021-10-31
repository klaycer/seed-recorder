import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Routes from '../Components/Routes';
import ToggleDraggable from '../Components/Utils/ToggleDraggable';
import { RecorderContext } from '../Contexts/RecorderProvider';
import ExportData from './Utils/ExportData';


const Main = () => {

    const exportType = (data, type) => {
        if(data?.count > 0){
            return <ExportData seedData={data.list} type={(type).toUpperCase()}/>
        }
        else{
            return <Fragment></Fragment>
        }
    }

    return (
        <RecorderContext.Consumer>
            {({ crashData, limboData, diceData }) => (
            <section className="text-gray-400 bg-gray-900 body-font w-full h-full">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-20"> 
                        <ToggleDraggable />
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
                            Seed Recorder
                        </h1>
                        <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                            The name says it for itself. Record results from gameplay...
                        </p>
                    </div>
                    <div className="flex flex-wrap -m-4 text-center">
                        {Routes.map(r => {
                            return (
                                <Fragment key={r.path}>
                                    {Array.isArray(r.childRoutes) && r.childRoutes.map(cr => {
                                        const Icon = cr.icon
                                        return (
                                            <div key={cr.path} className="p-4 md:w-1/3 sm:w-1/2 w-full">
                                                <Link to={cr.path} className="border-2 border-gray-800 px-4 py-6 rounded-lg">
                                                    <Icon className="text-indigo-400 w-12 h-12 mb-3 inline-block"/>
                                                </Link>
                                                <h2 className="title-font font-medium text-3xl text-white pt-3">
                                                    {(cr.name === 'Crash') ? crashData.count  : ((cr.name === 'Limbo') ? limboData.count : ((cr.name === 'Dice') ? diceData.count : 0)) }
                                                </h2>
                                                <p className="leading-relaxed">{cr.name}</p>
                                                {exportType((cr.name === 'Crash') ? crashData  : ((cr.name === 'Limbo') ? limboData : ((cr.name === 'Dice') ? diceData : {})), cr.name)}
                                            </div>
                                        )
                                    })}
                                </Fragment>
                            )
                        })}
                    </div>
                </div>
            </section>
            )}
        </RecorderContext.Consumer>
    )
}

export default Main;