import { CircleWithInitial, IconButton, InputBoxType100, InputCheckBox, InputText, InputRadio, AddExtraBox } from "../components";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { base64Decode } from "~/utils/scripting";
import { PhoneFilledIcon, CloudIcon, EnvelopeIcon, PrinterIcon, ScissorIcon, PhoneStrokeIcon, ScissorThinIcon } from "~/icons/miscIcons";
import { measurementsTemplate } from "~/utils/measurements";
import { addMeasurements, getMeasurements } from "~/scripts/fetchMeasurements";
import { InfoIcon } from "~/icons/measurementsIcons";

type ContactProps = {
  id: string,
  name: string,
  phone: string,
  code: string,
  index: number
}
type InputType = 
| 'text'
| 'radio'
| 'checkbox'

const buttons = [
  {
    name: 'call',
    Icon: PhoneFilledIcon,
    callback: () => {}
  },
  {
    name: 'message',
    Icon: CloudIcon,
    callback: () => {}
  },
  {
    name: 'print',
    Icon: PrinterIcon,
    callback: () => {}
  },
  {
    name: 'email',
    Icon: EnvelopeIcon,
    callback: () => {}
  },
]


export default function Contact() {
  const { encodedData } = useParams();
  const { id, name, phone, code, index }: ContactProps = JSON.parse(base64Decode(encodedData));
  const [contact, setContact] = useState({id, name, phone, code});
  const [measurementsStatus, setMeasurementsStatus] = useState({ status: 100, message: ''});
  const [measurements, setMeasurements] = useState<any>({});
  const [modalIsShowing, setModalIsShowing] = useState<boolean>(false);

  const getSectionValue = (
    section: Section,
    label: string
  ): string => {
    if (section === 'genders') {
      return measurements?.genders ?? ''
    }
  
    const path = section.split('.')
    let target: any = measurements
  
    for (const key of path) {
      target = target?.[key]
    }
  
    return target?.find((m: any) => m.label === label)?.value ?? '' 
  }
  
  const renderInput = (
    m: any,
    section: Section,
    i: number
  ) => {
    switch (m.type) {
      case 'text':
        return (
          <InputText
            key={`${section}-${i}`}
            index={i}
            value={getSectionValue(section, m.label)}
            label={m.label}
            icon={m.icon}
            iconCss={m.css ?? 'h-5 w-5'}
            setter={(v: string) =>
              updateMeasurement(section, m.label, v)
            }
          />
        )
  
      case 'radio':
        return (
          <InputRadio
            key={`${section}-${i}`}
            name={section}
            checked={measurements?.genders === m.label}
            index={i}
            value={m.label}
            label={m.label}
            icon={m.icon}
            iconCss={m.css ?? 'h-5 w-5'}
            setter={(v: string) =>
              setMeasurements((prev: any) => ({
                ...prev,
                genders: v,
              }))
            }
          />
        )
  
      case 'checkbox':
        return (
          <InputCheckBox
            key={`${section}-${i}`}
            name={section}
            checked={measurements?.[section] === m.label}
            index={i}
            value={m.label}
            label={m.label}
            icon={m.icon}
            iconCss={m.css ?? 'h-5 w-5'}
            setter={(v: string) =>
              setMeasurements((prev: any) => ({
                ...prev,
                [section]: v,
              }))
            }
          />
        )
  
      default:
        return null
    }
  }
  

  const addExtra = (obj:any) => {
    setMeasurements((prev:any) => {
      const extra = prev.extra ?? []
  
      const exists = extra.some((e:any) => e.label === obj.label)
      if (exists) return prev
  
      return {
        ...prev,
        extra: [...extra, { ...obj }],
      }
    })

    console.log(obj)
  }
  
  type Section =
  | 'basics'
  | 'genders'
  | 'maleMeasurements.upperBody'
  | 'maleMeasurements.lowerBody'
  | 'femaleMeasurements.upperBody'
  | 'femaleMeasurements.lowerBody'
  | 'extra'

const updateMeasurement = (
  section: Section,
  label: string,
  value: string
) => {
  setMeasurements((prev:any) => {
    const next = structuredClone(prev)

    const path = section.split('.') as string[]
    let target: any = next

    for (const key of path) {
      target = target[key]
    }

    const item = target.find((m: any) => m.label === label)
    if (item) item.value = value

    return next
  })
}



  useEffect(() => {
    const template = {
      "genders": "male",
      "basics": [
          {
              "label": "height",
              "value": ""
          },
          {
              "label": "weight",
              "value": ""
          }
      ],
      "maleMeasurements": {
          "upperBody": [
              {
                  "label": "neck",
                  "value": ""
              },
              {
                  "label": "shoulders",
                  "value": ""
              },
              {
                  "label": "chest",
                  "value": ""
              },
              {
                  "label": "upperchest",
                  "value": ""
              },
              {
                  "label": "underbust",
                  "value": ""
              },
              {
                  "label": "arms",
                  "value": ""
              },
              {
                  "label": "biceps",
                  "value": ""
              },
              {
                  "label": "Wrists",
                  "value": ""
              },
              {
                  "label": "back",
                  "value": ""
              },
              {
                  "label": "front",
                  "value": ""
              },
              {
                  "label": "shoulder waist",
                  "value": ""
              }
          ],
          "lowerBody": [
              {
                  "label": "waist",
                  "value": ""
              },
              {
                  "label": "high hip",
                  "value": ""
              },
              {
                  "label": "hip",
                  "value": ""
              },
              {
                  "label": "thigh",
                  "value": ""
              },
              {
                  "label": "knee",
                  "value": ""
              },
              {
                  "label": "calf",
                  "value": ""
              },
              {
                  "label": "outseam",
                  "value": ""
              },
              {
                  "label": "inseam",
                  "value": ""
              },
              {
                  "label": "pajama",
                  "value": ""
              }
          ]
      },
      "femaleMeasurements": {
          "upperBody": [
              {
                  "label": "neck",
                  "value": ""
              },
              {
                  "label": "shoulders",
                  "value": ""
              },
              {
                  "label": "chest",
                  "value": ""
              },
              {
                  "label": "upperchest",
                  "value": ""
              },
              {
                  "label": "underbust",
                  "value": ""
              },
              {
                  "label": "arms",
                  "value": ""
              },
              {
                  "label": "biceps",
                  "value": ""
              },
              {
                  "label": "Wrists",
                  "value": ""
              },
              {
                  "label": "back",
                  "value": ""
              },
              {
                  "label": "front",
                  "value": ""
              },
              {
                  "label": "shoulder waist",
                  "value": ""
              }
          ],
          "lowerBody": [
              {
                  "label": "waist",
                  "value": ""
              },
              {
                  "label": "high hip",
                  "value": ""
              },
              {
                  "label": "hip",
                  "value": ""
              },
              {
                  "label": "waist to hip",
                  "value": ""
              },
              {
                  "label": "thigh",
                  "value": ""
              },
              {
                  "label": "knee",
                  "value": ""
              },
              {
                  "label": "calf",
                  "value": ""
              },
              {
                  "label": "outseam",
                  "value": ""
              },
              {
                  "label": "inseam",
                  "value": ""
              },
              {
                  "label": "pajama",
                  "value": ""
              }
          ]
      }
  }
    setMeasurements(template)
    getMeasurements(contact.id).then(res => {
      setMeasurements(res.data[0].measurements[0]);
      console.log(res.data)
      setMeasurementsStatus({status: res.status, message: res.message});
    }).catch(err => {
      setMeasurementsStatus(err.status)
    })
  },[])

  useEffect(() => {
    console.log(measurements)
    console.log(measurementsTemplate)
  })
  return <main className="px-8 flex flex-col gap-8 pb-14">
    <section className="flex flex-col items-center gap-4 pt-15">
      <CircleWithInitial text={contact.name} css=' text-[50px]' index={index} />
      <p className="capitalize text-center text-heading-200 text-clr-100 font-normal">{contact.name}</p>
    </section>
    <section className="flex justify-between ">
      {buttons.map((btn,i) => <div key={i} className="flex flex-col gap-1 items-center">
        <IconButton icon={btn.Icon} css="" callback={btn.callback}/>
        <p className="capitalize text-text-200 text-clr-200">{btn.name}</p>
      </div>)}
    </section>
    <section className="flex flex-col gap-4 stroke-clr-200">
      <InputBoxType100 iconCss=" w-6 stroke-clr-200" text={contact.phone} icon={PhoneStrokeIcon} label={'Mobile'} setter={(value) => {setContact(prev => ({...prev, phone: value}))}}/>
      <InputBoxType100 iconCss="w-6 fill-clr-200 rotate-[180deg]" text={contact.code} icon={ScissorThinIcon} label={'Dress Code'} setter={(value) => {setContact(prev => ({...prev, code: value}))}}/>
    </section>

    <section className="flex flex-col gap-4">
      <h3 className="text-clr-100 text-heading-200">Measurements:</h3>
      <div className="grid gap-2">
        <h4 className="text-clr-100 text-text-100">Basic:</h4>
        <div className="flex justify-between gap-2">
          {measurementsTemplate.basics.map((m:any, i:number) => renderInput(m, 'basics', i))}
        </div>
      </div>
      
      <div className="grid gap-2">
        <h4 className="text-clr-100 text-text-100">Gender:</h4>
        <div className="flex justify-between gap-2">
          {measurementsTemplate.genders.map((m:any, i:number) => renderInput(m, 'genders', i))}
        </div>
      </div>

      <div className="grid gap-2">
        <h4 className="text-clr-100 text-text-100">Upper Body:</h4>
        <div className="flex flex-wrap justify-between gap-x-2 gap-y-4">
        {(measurements.genders === 'male' ? measurementsTemplate.maleMeasurements.upperBody
          : measurementsTemplate.femaleMeasurements.upperBody).map((m: any, i: number) => renderInput(m, measurements.genders === 'male' ? 'maleMeasurements.upperBody' : 'femaleMeasurements.upperBody', i)
        )}
        </div>
      </div>
      
      <div className="grid gap-2">
        <h4 className="text-clr-100 text-text-100">Lower Body:</h4>
        <div className="flex flex-wrap justify-between gap-x-2 gap-y-4">
        {(measurements.genders === 'male' ? measurementsTemplate.maleMeasurements.lowerBody
          : measurementsTemplate.femaleMeasurements.lowerBody).map((m: any, i: number) => renderInput(m, measurements.genders === 'male' ? 'maleMeasurements.lowerBody' : 'femaleMeasurements.lowerBody', i)
        )}
        </div>
      </div>

      <div className="grid gap-2">
        <h4 className="text-clr-100 text-text-100">Extra:</h4>
        <div className="flex flex-wrap justify-between gap-x-2 gap-y-4">
        {/* {measurements?.extra?.map(({m, i}:{m:any, i:any}) => renderInput(m, 'extra', i))} */}
        {measurements?.extra?.map(({m, i}:{m:any, i:any}) => <InputText index={i} icon={InfoIcon} value={m?.value ?? ''} label={m?.label ?? ''} iconCss="h-6 w-6" setter={(v: string) => setMeasurements((prev: any) => ({...prev,extra: v,}))}  />)}
        <button className='bg-bg-200 h-15 px-4 py-2.5 w-[46%] max-w-[46%] sm:max-w-[50%] flex items-center justify-between rounded-[10px]' onClick={() => setModalIsShowing(true)}>
            <div className='flex gap-2 items-center justify-between w-full'>
                <div className='flex-1'>
                    +
                    <p className='text-text-300 text-clr-200 font-light w-full text-center'>{'ADD'}</p>
                </div>
            </div>
        </button>
        </div>
      </div>

    </section>
    <AddExtraBox modalIsShowing={modalIsShowing} setModalIsShowing={setModalIsShowing} addExtra={(obj:any) => addExtra(obj)}/>


  </main>
}
