'use client';

import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';

import type { ItemWithAddons } from '~/server/db/schemas/posSchema';
import { api } from '~/trpc/react';
import { formatCurrency } from '~/utils/uiUtils';

import clsx from 'clsx';

type ItemFormInput = {
  name: string,
  description: string,
  basePrice: number,
}

export default function AdminEditItemForm({ item }: { item: ItemWithAddons }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ItemFormInput>();
  const itemMutation = api.admin.updateItem.useMutation({
    onSuccess: () => {
      toast("Item Updated")
    },
  })

  const onSubmit: SubmitHandler<ItemFormInput> = ({ name, description, basePrice }) => {
    const updatedItem = {
      id: item.id,
      menuId: item.menuId,
      name,
      description,
      basePrice: basePrice * 100
    };

    toast("Updating...")
    itemMutation.mutate(updatedItem);
  };

  return (
    <>
      <ToastContainer />

      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label>Name</label>
        <input className={clsx("border-black border-2", { "bg-red-50": errors.name })} {...register("name", { required: true })} defaultValue={item.name} />

        <div className="p-3" />

        <label>Description</label>
        <textarea className={clsx("border-black border-2", { "bg-red-50": errors.description })} {...register("description")} defaultValue={item.description ?? ""} />

        <div className="p-3" />

        <label>Price</label>
        <input className={clsx("border-black border-2", { "bg-red-50": errors.basePrice })} {...register("basePrice", { required: true, min: 0.0, pattern: /^\$?\d+(\.\d\d)?$/ })} defaultValue={formatCurrency(item.basePrice)} />

        <div className="p-3" />

        {
          item.addons.map((addon) => {
            return (
              <div key={addon.id}>
                <input type="checkbox" defaultChecked /><span> {addon.name}: ${formatCurrency(addon.price)}</span>
              </div>
            );
          })
        }

        <button className="rounded-lg absolute right-10 bottom-10 bg-gray-300 drop-shadow-md p-5 max-h-20 max-w-20 text-center" type="submit"><span className="static">Update</span></button>
      </form>
    </>
  );
}
