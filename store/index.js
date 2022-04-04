export const state = () => ({
    userInfo: {
        first_name: '',
        last_name: '',
        email: '',
        tel: '',
        position: '',
        address_from_gmap: '',
        address_from_user: '',
        address_id: ''
    },
    taskInfo: {
        remark: '',
        status_id: '',
        cancel_detail: '',
        position: '',
        address_from_gmap: '',
        address_from_user: '',
        address_id: '',
        requirement:'',
    }
})

export const mutations = {
    SET_userInfo(state, { userInfo = state.userInfo, }) {
        state.userInfo = {
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            tel: userInfo.tel,
            position: userInfo.position,
            address_from_gmap: userInfo.address_from_gmap,
            address_from_user: userInfo.address_from_user,
            address_id: userInfo.address_id
        }
    },
    SET_taskInfo(state, { taskInfo = state.userInfo, }) {
        state.taskInfo = {
            remark: taskInfo.remark,
            status_id: taskInfo.status_id,
            cancel_detail: taskInfo.cancel_detail,
            position: taskInfo.position,
            address_from_gmap: taskInfo.address_from_gmap,
            address_from_user: taskInfo.address_from_user,
            address_id: taskInfo.address_id,
            requirement: taskInfo.requirement,
        }
    }
}