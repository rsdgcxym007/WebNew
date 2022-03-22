export const state = () => ({
    userInfo: {
        first_name: '',
        last_name: '',
        email: '',
        tel: '',
        address: ''

    },
    taskInfo: {
        remark:''
    }
})

export const mutations = {
    SET_userInfo(state, { userInfo = state.userInfo, }) {
        state.userInfo = {
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            tel: userInfo.tel,
            address: userInfo.address,
        }
    },
    SET_taskInfo(state, { taskInfo = state.userInfo, }) {
        state.taskInfo = {
            remark: taskInfo.remark,
        }
    }
}
