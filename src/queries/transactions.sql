-- NOTE(Adin): This is unfinished and does not work
--             I'm committing it for posterity

WITH
	correlated_items AS (
		SELECT
			items.*,
			transaction_items.transaction_id,
			transaction_items.id AS transaction_item_id
		FROM
			interview_pos_item items
			JOIN interview_pos_transaction_item transaction_items
			ON items.id = transaction_items.item_id
	),

	correlated_addons AS (
		SELECT
			addons.*,
			transaction_addons.transaction_item_id AS transaction_item_id,
			transaction_addons.quantity AS quantity,
			transaction_items.transaction_id AS transaction_id
		FROM
			interview_pos_transaction_addon transaction_addons
			LEFT JOIN interview_pos_addon AS addons
				ON addons.id = transaction_addons.addon_id
			JOIN interview_pos_transaction_item transaction_items
			ON transaction_addons.transaction_item_id = transaction_items.id

	),

	items_with_totals AS (
		SELECT
			transaction_items.transaction_id,
			correlated_items.id as item_id,
			addons.id,
			transaction_addons.id
-- 			correlated_items.base_price + SUM(addons.price) AS "item_total"
		FROM
			interview_pos_transaction_addon transaction_addons
			LEFT JOIN interview_pos_addon addons
				ON transaction_addons.addon_id = addon_id
			LEFT JOIN interview_pos_transaction_item transaction_items
				ON transaction_addons.transaction_item_id = transaction_items.id
			LEFT JOIN correlated_items
				ON transaction_items.item_id = correlated_items.id
	)

SELECT * FROM items_with_totals

-- 	items_with_totals AS (
-- 		SELECT
--
-- 		FROM
-- 			interview_pos_item items
-- 	)
--
-- 	SELECT * FROM correlated_items LEFT JOIN correlated_addons ON correlated_items.transaction_item_id = correlated_addons.transaction_item_id

-- SELECT * FROM correlated_items LEFT JOIN correlated_addons ON correlated_items.transaction_item_id = correlated_addons.transaction_item_id;

-- Note(Adin): basePrice is the price of an item and price is the price of an addon
--			   it's easier to do it this way instead of list out all columns on the
--			   the correlation tables


--SELECT transactions.id AS id, transactions.timestamp AS "timestamp", base_totals.total
--	FROM interview_pos_transaction transactions
--	INNER JOIN (
--		SELECT
--			transaction_items.transaction_id as transaction_id, SUM(items.base_price) as total
--		FROM
--			interview_pos_transaction_item transaction_items JOIN interview_pos_item items ON transaction_items.item_id = items.id
--		GROUP BY transaction_items.transaction_id
--	) base_totals ON transactions.id = base_totals.transaction_id
;
