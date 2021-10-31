import React, { Fragment, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { GrDocumentCsv } from 'react-icons/gr';
import { VscJson } from 'react-icons/vsc';

const ExportData = ({ seedData, type }) => {
    const [options] = useState([
        {
            key: 'json',
            name: 'JSON'
        },
        {
            key: 'csv',
            name: 'CSV'
        },
    ])

    const dataToString = async(data, header = true) => {
        if (data.length === 0) {
            return '';
        }

        const tempHeader = Object.keys(data[0]);

        const isNestedObject = (value) => {
            return typeof value === 'object' &&
            !Array.isArray(value) &&
            value !== null
        }

        let columnNames = []

        for(let k in tempHeader){
            if(isNestedObject(data[0][tempHeader[k]])){
                for(let j in data[0][tempHeader[k]]){
                    columnNames.push(tempHeader[k] +'_'+ j)
                }
            }
            else if(!Array.isArray(data[0][tempHeader[k]])){
                columnNames.push(tempHeader[k])
            }
        }

        const processRow = (row) => {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : (row[j] || "").toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;
            }
            return finalVal + '\n';
        }
        
        let csvFile = '';

        if (header) {
            csvFile += processRow(columnNames);
        }
        
        for (var i = 0; i < data.length; i++) {
            let tmpArr = [], row = data[i]
            for(let k in tempHeader){
                if(isNestedObject(row[tempHeader[k]])){
                    for(let j in row[tempHeader[k]]){
                      tmpArr.push(row[tempHeader[k]][j])
                    }
                }
                else if(!Array.isArray(row[tempHeader[k]])){
                    tmpArr.push(row[tempHeader[k]])
                }
            }
            csvFile += processRow(tmpArr);
        }

        return csvFile
    }

    const currentDateFormat = () => {
        const d = new Date();
        return [d.getFullYear(), (d.getMonth()+1), d.getDate(), "__", d.getHours(), d.getMinutes()].join("");
    }
    
    const downloadType = async(blob, optionKey, fileName) => {
        try{
            const href = await URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = fileName + "." + optionKey;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return true;
        }
        catch(err){
            console.log('Failed to download', err)
        }
    }

    const exportType = async(option) => {
        const fileName = type+"_export_"+currentDateFormat()
        let blob = ''
        switch(option.key){
            case 'json':
                const json = JSON.stringify(seedData);
                blob = new Blob([json],{type:'application/json'});
                break;
            case 'csv':
                const csvInput = await dataToString(seedData);
                blob = new Blob([csvInput],{type:'text/csv;charset=utf-8;'});
                break;
            default:
                break;
        }
        await downloadType(blob, option.key, fileName);
    }

    return (
        <Fragment>
            <div className="relative inline-block text-left dropdown mt-3">
                <span className="rounded-md shadow-sm">
                    <button type="button" className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-indigo-400 border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
                        Export
                        <RiArrowDropDownLine className="-mr-1 ml-2 h-5 w-5"/>
                    </button>
                </span>
                <div className="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
                    <div className="absolute right-0 w-28 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
                        <div className="py-1" role="none">
                            {options.map((item) => (
                                <button type="button" onClick={async () => exportType(item)} key={item.key} className="text-gray-700 flex justify-between w-full px-2 py-1 text-sm leading-5 text-left" role="menuitem" id={"menu-item_"+item.key}>
                                    {(item.key === 'json' ? <VscJson /> : ( item.key === 'csv' ? <GrDocumentCsv /> : ''))} {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ExportData;