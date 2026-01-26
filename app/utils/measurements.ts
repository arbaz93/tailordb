import { MaleIcon, FemaleIcon, ArmsIcon, BackIcon, BicepsIcon, CalfIcon, ChestIcon, FrontIcon, HeightIcon, HighHipIcon, HipIcon, InfoIcon, InseamIcon, KneeIcon, NeckIcon, OutseamIcon, ShirtIcon, ShoulderBustPointIcon, ShoulderWaistIcon, ShouldersIcon, ThighIcon, UnderBustIcon, UpperChestIcon, WaistHipIcon, WaistIcon, WidthIcon, WristsIcon } from "~/icons/measurementsIcons"

export const measurementsTemplate = {
    "units": "cm",
    "genders": [
        {
            label: "male",
            icon: MaleIcon,
            type: 'radio',
            css: "w-2.25 h-6"
        },
        {
            label: "female",
            icon: FemaleIcon,
            type: 'radio',
            css: "w-3 h-6"
        }
    ],
    "basics": [
        {
            label: 'height',
            icon: HeightIcon,
            type: 'text',
            css: 'w-3.25 h-5'
        },
        {
            label: 'weight',
            icon: WidthIcon,
            type: 'text',
            css: 'w-6 h-3.25'
        },
    ],
    "maleMeasurements": {
        "upperBody": [
            {
                label: 'neck',
                icon: NeckIcon,
                type: 'text',
                css: 'w-6 h-6'
            },
            {
                label: 'shoulders',
                icon: ShouldersIcon,
                type: 'text',
                css: 'w-5.75 h-6'
            },
            {
                label: 'chest',
                icon: ChestIcon,
                type: 'text',
                css: 'w-6 h-4.75'
            },
            {
                label: 'upperchest',
                icon: UpperChestIcon,
                type: 'text',
                css: 'w-6 h-4.75'
            },
            {
                label: 'underbust',
                icon: UnderBustIcon,
                type: 'text',
                css: 'w-6 h-4.75'
            },
            {
                label: 'arms',
                icon: ArmsIcon,
                type: 'text',
                css: 'w-6 h-6'
            },
            {
                label: 'biceps',
                icon: BicepsIcon,
                type: 'text',
                css: 'w-6 h-6'
            },
            {
                label: 'Wrists',
                icon: WristsIcon,
                type: 'text',
                css: 'w-6 h-5.25'
            },
            {
                label: 'back',
                icon: BackIcon,
                type: 'text',
                css: 'w-6 h-6.5'
            },
            {
                label: 'front',
                icon: FrontIcon,
                type: 'text',
                css: 'w-6 h-5'
            },
            {
                label: 'shoulder waist',
                icon: ShoulderWaistIcon,
                type: 'text',
                css: 'w-6 h-5.25'
            },
        ],
        "lowerBody": [
            {
                label: 'waist',
                icon: WaistIcon,
                type: 'text',
                css: 'w-6 h-7.5'
            },
            {
                label: 'high hip',
                icon: HighHipIcon,
                type: 'text',
                css: 'w-6 h-7.5'
            },
            {
                label: 'hip',
                icon: HipIcon,
                type: 'text',
                css: 'w-6 h-7'
            },
            {
                label: 'thigh',
                icon: ThighIcon,
                type: 'text',
                css: 'w-6 h-7'
            },
            {
                label: 'knee',
                icon: KneeIcon,
                type: 'text',
                css: 'w-6 h-6'
            },
            {
                label: 'calf',
                icon: CalfIcon,
                type: 'text',
                css: 'w-6 h-6'
            },
            {
                label: 'outseam',
                icon: OutseamIcon,
                type: 'text',
                css: 'w-6 h-8.5'
            },
            {
                label: 'inseam',
                icon: InseamIcon,
                type: 'text',
                css: 'w-6 h-8.5'
            },
            {
                label: 'pajama',
                icon: OutseamIcon,
                type: 'text',
                css: 'w-6 h-8.5'
            }
        ],
    },
    "femaleMeasurements": {
        "upperBody": [
            {
                label: 'neck',
                icon: NeckIcon,
                type: 'text',
                css: 'w-6 h-6'
            },
            {
                label: 'shoulders',
                icon: ShouldersIcon,
                type: 'text',
                css: 'w-5.75 h-6'
            },
            {
                label: 'chest',
                icon: ChestIcon,
                type: 'text',
                css: 'w-6 h-4.75'
            },
            {
                label: 'upperchest',
                icon: UpperChestIcon,
                type: 'text',
                css: 'w-6 h-4.75'
            },
            {
                label: 'underbust',
                icon: UnderBustIcon,
                type: 'text',
                css: 'w-6 h-4.75'
            },
            {
                label: 'arms',
                icon: ArmsIcon,
                type: 'text',
                css: 'w-6 h-6'
            },
            {
                label: 'biceps',
                icon: BicepsIcon,
                type: 'text',
                css: 'w-6 h-6'
            },
            {
                label: 'Wrists',
                icon: WristsIcon,
                type: 'text',
                css: 'w-6 h-5.25'
            },
            {
                label: 'back',
                icon: BackIcon,
                type: 'text',
                css: 'w-6 h-6.5'
            },
            {
                label: 'front',
                icon: FrontIcon,
                type: 'text',
                css: 'w-6 h-5'
            },
            {
                label: 'shoulder waist',
                icon: ShoulderWaistIcon,
                type: 'text',
                css: 'w-6 h-5.25'
            },
        ],
        "lowerBody": [
            {
                label: 'waist',
                icon: WaistIcon,
                type: 'text',
                css: 'w-6 h-7.5'
            },
            {
                label: 'high hip',
                icon: HighHipIcon,
                type: 'text',
                css: 'w-6 h-7.5'
            },
            {
                label: 'hip',
                icon: HipIcon,
                type: 'text',
                css: 'w-6 h-7'
            },
            {
                label: 'waist to hip',
                icon: WaistHipIcon,
                type: 'text',
                css: 'w-6 h-8'
            },
            {
                label: 'thigh',
                icon: ThighIcon,
                type: 'text',
                css: 'w-6 h-7'
            },
            {
                label: 'knee',
                icon: KneeIcon,
                type: 'text',
                css: 'w-6 h-6'
            },
            {
                label: 'calf',
                icon: CalfIcon,
                type: 'text',
                css: 'w-6 h-6'
            },
            {
                label: 'outseam',
                icon: OutseamIcon,
                type: 'text',
                css: 'w-6 h-8.5'
            },
            {
                label: 'inseam',
                icon: InseamIcon,
                type: 'text',
                css: 'w-6 h-8.5'
            },
            {
                label: 'pajama',
                icon: OutseamIcon,
                type: 'text',
                css: 'w-6 h-8.5'
            }
        ],
    },
}
