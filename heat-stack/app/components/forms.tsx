import { useInputControl } from '@conform-to/react'
import { REGEXP_ONLY_DIGITS_AND_CHARS, type OTPInputProps } from 'input-otp'
import React, { useId } from 'react'
import { cn } from '#app/utils/misc.tsx'
import { Checkbox, type CheckboxProps } from './ui/checkbox.tsx'
import { HelpButton } from './ui/HelpButton.tsx'
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from './ui/input-otp.tsx'
import { Input } from './ui/input.tsx'
import { Label } from './ui/label.tsx'
import { Textarea } from './ui/textarea.tsx'

export type ListOfErrors = Array<string | null | undefined> | null | undefined

export function ErrorList({
	id,
	errors,
}: {
	errors?: ListOfErrors
	id?: string
}) {
	const errorsToRender = errors?.filter(Boolean)
	if (!errorsToRender?.length) return null
	return (
		<ul id={id} className="flex flex-col gap-1">
			{errorsToRender.map((e) => (
				<li key={e} className="text-[10px] text-foreground-destructive">
					{e}
				</li>
			))}
		</ul>
	)
}

type Help = { keyName: string }

function TitleText({
	help,
	children,
}: {
	help?: Help
	children: React.ReactNode
}) {
	if (!help) return children
	return (
		<span className="flex items-center gap-2">
			{children}
			<HelpButton keyName={help.keyName} />
		</span>
	)
}

// The help button sits beside the label, not inside it: a <label> may only
// contain the control it labels.
export function LabelWithHelp({
	help,
	...labelProps
}: React.ComponentProps<typeof Label> & { help?: Help }) {
	const label = <Label {...labelProps} />
	if (!help) return label
	return (
		<div className="flex items-center gap-2">
			{label}
			<HelpButton keyName={help.keyName} />
		</div>
	)
}

export function SectionDivider() {
	return <hr className="mb-[45px] mt-[30px] border-gray-300" />
}

export function SectionTitle({
	as = 'legend',
	help,
	className,
	children,
}: {
	as?: 'legend' | 'h2'
	help?: Help
	className?: string
	children: React.ReactNode
}) {
	const Tag = as
	return (
		<Tag
			className={cn('mb-[10px] text-4xl font-bold tracking-wide', className)}
		>
			<TitleText help={help}>{children}</TitleText>
		</Tag>
	)
}

type SubsectionTitleProps = {
	help?: Help
	className?: string
	children: React.ReactNode
} & (
	| { as: 'label'; htmlFor: string }
	| { as?: 'legend' | 'h3'; htmlFor?: never }
)

export function SubsectionTitle(props: SubsectionTitleProps) {
	const { help, className, children } = props
	const baseClasses = 'text-2xl font-semibold text-zinc-950'
	if (props.as === 'label') {
		return (
			<div className={className}>
				<LabelWithHelp
					htmlFor={props.htmlFor}
					className={baseClasses}
					help={help}
				>
					{children}
				</LabelWithHelp>
			</div>
		)
	}
	const Tag = props.as ?? 'h3'
	return (
		<Tag className={cn(baseClasses, className)}>
			<TitleText help={help}>{children}</TitleText>
		</Tag>
	)
}

// Reserves a fixed-height error slot so stacked fields keep their spacing;
// collapseWhenEmpty drops the slot until there is an error to show.
export function FieldErrors({
	id,
	errors,
	collapseWhenEmpty = false,
}: {
	id?: string
	errors?: ListOfErrors
	collapseWhenEmpty?: boolean
}) {
	if (collapseWhenEmpty && !errors?.filter(Boolean).length) return null
	return (
		<div className="min-h-[32px] px-4 pb-3 pt-1">
			<ErrorList id={id} errors={errors} />
		</div>
	)
}

export function Field({
	labelProps,
	inputProps,
	errors,
	className,
	help,
	description,
	collapseEmptyErrors = false,
}: {
	labelProps: React.LabelHTMLAttributes<HTMLLabelElement>
	inputProps: React.InputHTMLAttributes<HTMLInputElement>
	errors?: ListOfErrors
	className?: string
	help?: Help
	description?: React.ReactNode
	collapseEmptyErrors?: boolean
}) {
	const fallbackId = useId()
	const id = inputProps.id ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined
	const descriptionId = description ? `${id}-description` : undefined
	const ariaDescribedBy =
		[inputProps['aria-describedby'] ?? errorId, descriptionId]
			.filter(Boolean)
			.join(' ') || undefined
	return (
		<div className={className}>
			<LabelWithHelp htmlFor={id} {...labelProps} help={help} />
			<Input
				id={id}
				aria-invalid={errorId ? true : undefined}
				{...inputProps}
				aria-describedby={ariaDescribedBy}
			/>
			{description ? (
				<div id={descriptionId} className="mt-2 text-sm text-slate-500">
					{description}
				</div>
			) : null}
			<FieldErrors
				id={errorId}
				errors={errors}
				collapseWhenEmpty={collapseEmptyErrors}
			/>
		</div>
	)
}

export function OTPField({
	labelProps,
	inputProps,
	errors,
	className,
}: {
	labelProps: React.LabelHTMLAttributes<HTMLLabelElement>
	inputProps: Partial<OTPInputProps & { render: never }>
	errors?: ListOfErrors
	className?: string
}) {
	const fallbackId = useId()
	const id = inputProps.id ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined
	return (
		<div className={className}>
			<Label htmlFor={id} {...labelProps} />
			<InputOTP
				pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
				maxLength={6}
				id={id}
				aria-invalid={errorId ? true : undefined}
				aria-describedby={errorId}
				{...inputProps}
			>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
				</InputOTPGroup>
				<InputOTPSeparator />
				<InputOTPGroup>
					<InputOTPSlot index={3} />
					<InputOTPSlot index={4} />
					<InputOTPSlot index={5} />
				</InputOTPGroup>
			</InputOTP>
			<FieldErrors id={errorId} errors={errors} />
		</div>
	)
}

export function TextareaField({
	labelProps,
	textareaProps,
	errors,
	className,
}: {
	labelProps: React.LabelHTMLAttributes<HTMLLabelElement>
	textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>
	errors?: ListOfErrors
	className?: string
}) {
	const fallbackId = useId()
	const id = textareaProps.id ?? textareaProps.name ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined
	return (
		<div className={className}>
			<Label htmlFor={id} {...labelProps} />
			<Textarea
				id={id}
				aria-invalid={errorId ? true : undefined}
				aria-describedby={errorId}
				{...textareaProps}
			/>
			<FieldErrors id={errorId} errors={errors} />
		</div>
	)
}

export function CheckboxField({
	labelProps,
	buttonProps,
	errors,
	className,
}: {
	labelProps: React.ComponentProps<'label'>
	buttonProps: CheckboxProps & {
		name: string
		form: string
		value?: string
	}
	errors?: ListOfErrors
	className?: string
}) {
	const { key, defaultChecked, ...checkboxProps } = buttonProps
	const fallbackId = useId()
	const checkedValue = buttonProps.value ?? 'on'
	const input = useInputControl({
		key,
		name: buttonProps.name,
		formId: buttonProps.form,
		initialValue: defaultChecked ? checkedValue : undefined,
	})
	const id = buttonProps.id ?? fallbackId
	const errorId = errors?.length ? `${id}-error` : undefined

	return (
		<div className={className}>
			<div className="flex gap-2">
				<Checkbox
					{...checkboxProps}
					id={id}
					aria-invalid={errorId ? true : undefined}
					aria-describedby={errorId}
					checked={input.value === checkedValue}
					onCheckedChange={(state) => {
						input.change(state.valueOf() ? checkedValue : '')
						buttonProps.onCheckedChange?.(state)
					}}
					onFocus={(event) => {
						input.focus()
						buttonProps.onFocus?.(event)
					}}
					onBlur={(event) => {
						input.blur()
						buttonProps.onBlur?.(event)
					}}
					type="button"
				/>
				<label
					htmlFor={id}
					{...labelProps}
					className="self-center text-body-xs text-muted-foreground"
				/>
			</div>
			<div className="px-4 pb-3 pt-1">
				{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
			</div>
		</div>
	)
}
