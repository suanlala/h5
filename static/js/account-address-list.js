export default {
	data() {
		return {
			addressList: [
				{
					name: '撐先生',
					phone: '+86 15822223333',
					detail: '香港特别行政区荃湾区沙咀道364-366号'
				},
				{
					name: '李女士',
					phone: '+86 13988887777',
					detail: '香港特别行政区九龙区尖沙咀弥敦道100号'
				}
			]
		}
	},
	onLoad(options) {
		// 加载地址列表数据
		this.loadAddressList()
	},
	onShow() {
		// 页面显示时重新加载数据（从新增/编辑地址页面返回时会触发）
		this.loadAddressList()
	},
	methods: {
		// 加载地址列表
		async loadAddressList() {
			try {
				// 这里应该调用接口获取地址列表
				// const res = await this.$request.get('/user/addresses')
				// if (res && res.data) {
				// 	this.addressList = res.data.list || []
				// }
				
				// 暂时使用本地存储或默认数据
				const savedAddresses = uni.getStorageSync('addressList')
				if (savedAddresses && savedAddresses.length > 0) {
					this.addressList = savedAddresses
				}
			} catch (e) {
				console.error('加载地址列表失败', e)
			}
		},
		// 返回
		handleBack() {
			uni.navigateBack()
		},
		// 新增地址
		handleAddAddress() {
			uni.navigateTo({
				url: '/pages/account/address'
			})
		},
		// 编辑地址
		handleEditAddress(address, index) {
			uni.navigateTo({
				url: `/pages/account/address?id=${address.id || index}&edit=true`
			})
		}
	}
}

