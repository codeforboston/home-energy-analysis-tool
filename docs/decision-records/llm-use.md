llms can be very helpful to problem solve and write solutions. However, they can if asked to do too much create code which is not helpful, and lead to large un-reviewable PRS.


We should be Biased to not merge/commit things we don't understand well from LLM.

To help with this:
1. PRs should be small and focused.
2. Force LLMs to work in small tasks.
3. Make sure to provide enough context, and **Strong gardrails** before allowing generation.
4. Review generated code and refine before accepting.