/*Error messages*/

module.exports = {
	no_order : 'No Order present for this Config. Kindly, place an order first.',
	order_closed : 'Order closed already. Contact Admin to reopen.',
	new_path : 'To update Configuration use PUT config/:order_id route.',
	empty_body : 'Body cant be left vacant.',
	no_config : 'No Configuration for this order Id has been received to be updated',
	scheduler_stop : '{"Message":"Scheduler stopped. Please change status of jobs manually."}',
	no_post : '{"errMsg":"Kindly use PUT /config/:id to update currently existing configs"}'
}