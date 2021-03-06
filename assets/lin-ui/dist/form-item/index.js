import rules from "../behaviors/rules";
Component({
    options: {
        multipleSlots: !0
    },
    externalClasses: ["l-form-item-class", "l-form-label-class", "l-form-content-class", "l-error-text-class"],
    behaviors: [rules],
    relations: {
        "../form/index": {
            type: "parent",
            linked: function () {},
            linkChanged: function () {},
            unlinked: function () {}
        }
    },
    properties: {
        label: String,
        labelPlacement: {
            type: String,
            value: "row"
        },
        alignItems: {
            type: String,
            value: "start"
        },
        labelWidth: {
            type: String,
            value: "auto"
        },
        labelSlot: {
            type: Boolean,
            value: !1
        },
        name: {
            type: String,
            value: ""
        }
    },
    data: {
        isRequired: !1
    },
    attached() {
        this.initRules(), this.isRequired()
    },
    methods: {
        isRequired() {
            this.data.rules.forEach(e => {
                e.required && this.setData({
                    isRequired: !0
                })
            })
        }
    }
});