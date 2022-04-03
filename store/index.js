export const state = () => ({
    userInfo: {
        first_name: '',
        last_name: '',
        email: '',
        tel: '',
        position: '',
        description: '',
        place :''

    },
    taskInfo: {
        remark: '',
        status_id: '',
        canceldetail:''
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
            description: userInfo.description,
            place: userInfo.place
        }
    },
    SET_taskInfo(state, { taskInfo = state.userInfo, }) {
        state.taskInfo = {
            remark: taskInfo.remark,
            status_id: taskInfo.status_id,
            canceldetail:taskInfo.cancledetail
        }
    }
}